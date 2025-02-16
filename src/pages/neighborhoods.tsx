import { useRouter } from 'next/router';
import Head from 'next/head';
import { useState } from 'react';
import type { NextPage } from 'next';
import neighborhoodsData from '../data/neighborhoods.json';

interface Neighborhood {
  name: string;
  value: string;
}

interface ManhattanArea {
  [key: string]: Neighborhood[];
}

interface NeighborhoodsData {
  food: {
    manhattan: {
      [key: string]: Neighborhood[];
    };
    brooklyn: Neighborhood[];
    queens: Neighborhood[];
  };
  drinks: {
    manhattan: {
      [key: string]: Neighborhood[];
    };
    brooklyn: Neighborhood[];
    queens: Neighborhood[];
  };
}

const Neighborhoods: NextPage = () => {
  const router = useRouter();
  const { to: category } = router.query;
  const [selectedNeighborhoods, setSelectedNeighborhoods] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const title = category === 'eat' ? 'Food' : 'Drinks';
  const data = category === 'eat' 
    ? (neighborhoodsData as NeighborhoodsData).food 
    : (neighborhoodsData as NeighborhoodsData).drinks;

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
  
    setLoading(true); // ✅ Start loading
  
    localStorage.setItem('selectedNeighborhoods', JSON.stringify(selectedNeighborhoods));
    const encodedNeighborhoods = selectedNeighborhoods
      .map(n => encodeURIComponent(n))
      .join('%2C'); // URL-encoded comma
  
    router.push(`/results?category=${category === 'eat' ? 'food' : 'drinks'}&neighborhoods=${encodedNeighborhoods}`)
      .finally(() => setLoading(false)); // ✅ Stop loading after navigation completes
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
    if (!neighborhoods) return null;
    
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

  return (
    <>
      <Head>
        <title>NYC {title} Neighborhoods</title>
        <meta name="description" content={`Discover the best neighborhoods for ${title.toLowerCase()} in New York City.`} />
      </Head>
      <h4 className="title">Neighborhood</h4>
      <div className="sections-container">
        {data.manhattan && (
          <div className="section borough">
            <div className="section-header" onClick={toggleSection}>
              <span>Manhattan</span>
              <span className="arrow">▼</span>
            </div>
            <div className="section-content">
              {renderManhattanAreas(data.manhattan)}
            </div>
          </div>
        )}
        {renderBoroughSection('Brooklyn', data.brooklyn)}
        {category === 'eat' && renderBoroughSection('Queens', (data as NeighborhoodsData['food']).queens)}
      </div>
      <button 
        className="submit-button" 
        disabled={loading || selectedNeighborhoods.length === 0}
        onClick={handleSubmit}
      >
        {loading ? "Loading..." : category === 'eat' ? "Let's Eat!" : "Let's Drink!"}
      </button>

    </>
  );
};

export default Neighborhoods;