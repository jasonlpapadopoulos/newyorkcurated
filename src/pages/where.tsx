import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import type { NextPage } from 'next';
import type { Neighborhood } from '../types/neighborhood';

interface ManhattanArea {
  [key: string]: Neighborhood[];
}

interface OrganizedNeighborhoods {
  manhattan: {
    [key: string]: Neighborhood[];
  };
  brooklyn: Neighborhood[];
  queens: Neighborhood[];
}

const Neighborhoods: NextPage = () => {
  const router = useRouter();
  const { to: category } = router.query;
  const [selectedNeighborhoods, setSelectedNeighborhoods] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [neighborhoodsData, setNeighborhoodsData] = useState<Neighborhood[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  // Fetch neighborhoods from API
  useEffect(() => {
    const fetchNeighborhoods = async () => {
      if (!category) return; // Wait for router query to be available
      
      try {
        setDataLoading(true);
        // Pass the category parameter to the API
        // const apiCategory = category === 'eat' ? 'food' : 'drinks';
        // const response = await fetch(`/api/where?category=${apiCategory}`);
        const response = await fetch(`/api/where?category=${category}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch neighborhoods');
        }
        
        const data: Neighborhood[] = await response.json();
        setNeighborhoodsData(data);
      } catch (error) {
        console.error('Error fetching neighborhoods:', error);
      } finally {
        setDataLoading(false);
      }
    };

    if (category) {
      fetchNeighborhoods();
    }
  }, [category]);

  const titleMap: Record<string, string> = {
    food: "Food",
    drinks: "Drinks",
    coffee: "Coffee",
    party: "Party",
  };
  
  const title = titleMap[category as string] || "Places";

  const buttonLabelMap: Record<string, string> = {
    food: "Let's Eat!",
    drinks: "Let's Drink!",
    coffee: "Let's Have Coffee!",
    party: "Let's Party!",
  };
  
  const buttonLabel = buttonLabelMap[category as string] || "Places";
  
  
  // Organize neighborhoods by borough and area
  const organizedData = React.useMemo(() => {
    const result: OrganizedNeighborhoods = {
      manhattan: {},
      brooklyn: [],
      queens: []
    };
  
    neighborhoodsData.forEach(neighborhood => {
      if (neighborhood.borough.toLowerCase() === 'manhattan') {
        const area = neighborhood.broader_area?.toLowerCase() || 'other';
  
        if (!result.manhattan[area]) {
          result.manhattan[area] = [];
        }
  
        result.manhattan[area].push(neighborhood);
      } else if (neighborhood.borough.toLowerCase() === 'brooklyn') {
        result.brooklyn.push(neighborhood);
      } else if (neighborhood.borough.toLowerCase() === 'queens') {
        result.queens.push(neighborhood);
      }
    });
  
    // Define the desired order
    const orderedManhattanAreas = ['uptown', 'midtown', 'downtown', 'other'];
  
    // Reconstruct result.manhattan with the desired order
    const sortedManhattan = orderedManhattanAreas.reduce((acc, area) => {
      if (result.manhattan[area]) {
        acc[area] = result.manhattan[area];
      }
      return acc;
    }, {} as Record<string, typeof result.manhattan[keyof typeof result.manhattan]>);
  
    return { ...result, manhattan: sortedManhattan };
  }, [neighborhoodsData]);
  

  const toggleSection = (event: React.MouseEvent<HTMLDivElement>) => {
    const header = event.currentTarget;
    const content = header.nextElementSibling as HTMLElement;
    
    header.classList.toggle('active');
    content.classList.toggle('open');
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>, section: HTMLElement) => {
    const checkboxes = section.querySelectorAll<HTMLInputElement>('input[name="neighborhood"]');
    checkboxes.forEach(checkbox => {
      checkbox.checked = event.target.checked;
    });
    updateSelectedNeighborhoods();
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>, section: HTMLElement) => {
    if (event.target.name === 'neighborhood') {
      const selectAll = section.querySelector<HTMLInputElement>('.select-all');
      const checkboxes = section.querySelectorAll<HTMLInputElement>('input[name="neighborhood"]');
      const allChecked = Array.from(checkboxes).every(cb => cb.checked);
      const someChecked = Array.from(checkboxes).some(cb => cb.checked);
      
      if (selectAll) {
        selectAll.checked = allChecked;
        selectAll.indeterminate = someChecked && !allChecked;
      }
      
      updateSelectedNeighborhoods();
    }
  };

  const updateSelectedNeighborhoods = () => {
    const selected = Array.from(document.querySelectorAll<HTMLInputElement>('input[name="neighborhood"]:checked'))
      .map(checkbox => checkbox.value);
    setSelectedNeighborhoods(selected);
  };

  const handleSubmit = () => {
    if (selectedNeighborhoods.length === 0) return;
  
    setLoading(true);
  
    localStorage.setItem('selectedNeighborhoods', JSON.stringify(selectedNeighborhoods));
    const encodedNeighborhoods = selectedNeighborhoods
      .map(n => encodeURIComponent(n))
      .join('%2C'); // URL-encoded comma
  
    router.push(`/results?category=${category}&neighborhoods=${encodedNeighborhoods}`)
      .finally(() => setLoading(false));
  };

  const renderManhattanAreas = (areas: ManhattanArea) => {
    return Object.entries(areas).map(([areaName, neighborhoods]) => (
      <div key={areaName} className="section area">
        <div className="section-header" onClick={toggleSection}>
          <span>{areaName.charAt(0).toUpperCase() + areaName.slice(1)}</span>
          <span className="arrow">▼</span>
        </div>
        <div className="section-content">
          <div className="select-all-section">
            <label className="checkbox-container select-all-container">
              <input 
                type="checkbox" 
                className="select-all"
                onChange={(e) => handleSelectAll(e, e.target.closest('.section-content') as HTMLElement)}
              />
              <div className="custom-checkbox"></div>
              All {areaName.charAt(0).toUpperCase() + areaName.slice(1)}
            </label>
          </div>
          <div className="neighborhood-list">
            {neighborhoods.map((neighborhood) => (
              <label key={neighborhood.value} className="checkbox-container">
                <input 
                  type="checkbox" 
                  name="neighborhood" 
                  value={neighborhood.value}
                  onChange={(e) => handleCheckboxChange(e, e.target.closest('.section-content') as HTMLElement)}
                />
                <div className="custom-checkbox"></div>
                {neighborhood.name}
              </label>
            ))}
          </div>
        </div>
      </div>
    ));
  };

  const renderBoroughSection = (boroughName: string, neighborhoods: Neighborhood[] | undefined) => {
    if (!neighborhoods || neighborhoods.length === 0) return null;
    
    return (
      <div className="section">
        <div className="section-header" onClick={toggleSection}>
          <span>{boroughName}</span>
          <span className="arrow">▼</span>
        </div>
        <div className="section-content">
          <div className="select-all-section">
            <label className="checkbox-container select-all-container">
              <input 
                type="checkbox" 
                className="select-all"
                onChange={(e) => handleSelectAll(e, e.target.closest('.section-content') as HTMLElement)}
              />
              <div className="custom-checkbox"></div>
              All {boroughName}
            </label>
          </div>
          <div className="neighborhood-list">
            {neighborhoods.map((neighborhood) => (
              <label key={neighborhood.value} className="checkbox-container">
                <input 
                  type="checkbox" 
                  name="neighborhood" 
                  value={neighborhood.value}
                  onChange={(e) => handleCheckboxChange(e, e.target.closest('.section-content') as HTMLElement)}
                />
                <div className="custom-checkbox"></div>
                {neighborhood.name}
              </label>
            ))}
          </div>
        </div>
      </div>
    );
  };

  if (dataLoading) {
    return <div className="loading">Loading neighborhoods...</div>;
  }

  return (
    <>
      <Head>
        <title>NYC {title} Neighborhoods</title>
        <meta name="description" content={`Discover the best neighborhoods for ${title.toLowerCase()} in New York City.`} />
      </Head>
      <h4 className="title">Where?</h4>
      <div className="sections-container">
        {Object.keys(organizedData.manhattan).length > 0 && (
          <div className="section borough">
            <div className="section-header" onClick={toggleSection}>
              <span>Manhattan</span>
              <span className="arrow">▼</span>
            </div>
            <div className="section-content">
              {renderManhattanAreas(organizedData.manhattan)}
            </div>
          </div>
        )}
        {renderBoroughSection('Brooklyn', organizedData.brooklyn)}
        {renderBoroughSection('Queens', organizedData.queens)}
      </div>
      <div id="div_next">
        <button 
          className="submit-button" 
          disabled={loading || selectedNeighborhoods.length === 0}
          onClick={handleSubmit}
        >
          {loading ? "Loading..." : buttonLabelMap[category as string] || "Let's Go!"}
        </button>
      </div>
    </>
  );
};

export default Neighborhoods;