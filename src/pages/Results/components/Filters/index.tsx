import { useState } from 'react';

interface FiltersProps {
  selectedFilters: {
    meals: Set<string>;
    price: Set<string>;
    cuisine: Set<string>;
  };
  onFilterChange: (filters: any) => void;
}

export default function Filters({ selectedFilters, onFilterChange }: FiltersProps) {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const handleFilterChange = (type: string, value: string) => {
    const newFilters = { ...selectedFilters };
    const filterSet = new Set(selectedFilters[type as keyof typeof selectedFilters]);

    if (filterSet.has(value)) {
      filterSet.delete(value);
    } else {
      filterSet.add(value);
    }

    newFilters[type as keyof typeof selectedFilters] = filterSet;
    onFilterChange(newFilters);
  };

  const toggleFilter = (filter: string) => {
    setActiveFilter(activeFilter === filter ? null : filter);
  };

  return (
    <div className="filters-container">
      <div className="filter-group">
        <button 
          className={`filter-button ${activeFilter === 'meal' ? 'active' : ''}`}
          onClick={() => toggleFilter('meal')}
        >
          Meal
        </button>
        <div className={`filter-options ${activeFilter === 'meal' ? 'show' : ''}`}>
          <label className="filter-option">
            <input 
              type="checkbox" 
              checked={selectedFilters.meals.has('breakfast')}
              onChange={() => handleFilterChange('meals', 'breakfast')}
            /> 
            Breakfast
          </label>
          <label className="filter-option">
            <input 
              type="checkbox" 
              checked={selectedFilters.meals.has('brunch')}
              onChange={() => handleFilterChange('meals', 'brunch')}
            /> 
            Brunch
          </label>
          <label className="filter-option">
            <input 
              type="checkbox" 
              checked={selectedFilters.meals.has('lunch')}
              onChange={() => handleFilterChange('meals', 'lunch')}
            /> 
            Lunch
          </label>
          <label className="filter-option">
            <input 
              type="checkbox" 
              checked={selectedFilters.meals.has('dinner')}
              onChange={() => handleFilterChange('meals', 'dinner')}
            /> 
            Dinner
          </label>
        </div>
      </div>

      <div className="filter-group">
        <button 
          className={`filter-button ${activeFilter === 'price' ? 'active' : ''}`}
          onClick={() => toggleFilter('price')}
        >
          Price
        </button>
        <div className={`filter-options ${activeFilter === 'price' ? 'show' : ''}`}>
          <label className="filter-option">
            <input 
              type="checkbox" 
              checked={selectedFilters.price.has('$')}
              onChange={() => handleFilterChange('price', '$')}
            /> 
            $
          </label>
          <label className="filter-option">
            <input 
              type="checkbox" 
              checked={selectedFilters.price.has('$$')}
              onChange={() => handleFilterChange('price', '$$')}
            /> 
            $$
          </label>
          <label className="filter-option">
            <input 
              type="checkbox" 
              checked={selectedFilters.price.has('$$$')}
              onChange={() => handleFilterChange('price', '$$$')}
            /> 
            $$$
          </label>
          <label className="filter-option">
            <input 
              type="checkbox" 
              checked={selectedFilters.price.has('$$$$')}
              onChange={() => handleFilterChange('price', '$$$$')}
            /> 
            $$$$
          </label>
        </div>
      </div>

      <div className="filter-group">
        <button 
          className={`filter-button ${activeFilter === 'cuisine' ? 'active' : ''}`}
          onClick={() => toggleFilter('cuisine')}
        >
          Cuisine
        </button>
        <div className={`filter-options ${activeFilter === 'cuisine' ? 'show' : ''}`}>
          {['American', 'Italian', 'Japanese', 'Chinese', 'Mexican', 'Thai', 'Indian', 'French', 'Mediterranean', 'Korean'].map(cuisine => (
            <label key={cuisine} className="filter-option">
              <input 
                type="checkbox" 
                checked={selectedFilters.cuisine.has(cuisine.toLowerCase())}
                onChange={() => handleFilterChange('cuisine', cuisine.toLowerCase())}
              /> 
              {cuisine}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}