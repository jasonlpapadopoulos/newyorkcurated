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

  const closeModal = () => {
    setActiveFilter(null);
  };

  const renderFilterModal = (type: string) => {
    const options = {
      meals: [ // Changed from 'meal' to 'meals' to match the selectedFilters interface
        { value: 'breakfast', label: 'Breakfast' },
        { value: 'brunch', label: 'Brunch' },
        { value: 'lunch', label: 'Lunch' },
        { value: 'dinner', label: 'Dinner' }
      ],
      price: [
        { value: '$', label: '$' },
        { value: '$$', label: '$$' },
        { value: '$$$', label: '$$$' },
        { value: '$$$$', label: '$$$$' }
      ],
      cuisine: [
        'American', 'Italian', 'Japanese', 'Chinese', 'Mexican',
        'Thai', 'Indian', 'French', 'Mediterranean', 'Korean'
      ].map(c => ({ value: c.toLowerCase(), label: c }))
    };

    const titles = {
      meals: 'Meal',
      price: 'Price Range',
      cuisine: 'Cuisine'
    };

    return (
      <>
        <div 
          className={`modal-backdrop ${activeFilter === type ? 'show' : ''}`}
          onClick={closeModal}
        />
        <div className={`filter-modal ${activeFilter === type ? 'show' : ''}`}>
          <div className="filter-modal-header">
            <span className="filter-modal-title">{titles[type as keyof typeof titles]}</span>
            <button className="filter-modal-close" onClick={closeModal}>×</button>
          </div>
          {options[type as keyof typeof options].map(({ value, label }) => (
            <label key={value} className="filter-option">
              <input
                type="checkbox"
                checked={selectedFilters[type as keyof typeof selectedFilters].has(value)}
                onChange={() => handleFilterChange(type, value)}
              />
              {label}
            </label>
          ))}
        </div>
      </>
    );
  };

  return (
    <div className="filters-container">
      <div className="filter-group">
        <button
          className={`filter-button ${activeFilter === 'meals' ? 'active' : ''}`}
          onClick={() => setActiveFilter(activeFilter === 'meals' ? null : 'meals')}
        >
          Meal {selectedFilters.meals.size > 0 && `(${selectedFilters.meals.size})`}
        </button>
        {renderFilterModal('meals')}
      </div>

      <div className="filter-group">
        <button
          className={`filter-button ${activeFilter === 'price' ? 'active' : ''}`}
          onClick={() => setActiveFilter(activeFilter === 'price' ? null : 'price')}
        >
          Price {selectedFilters.price.size > 0 && `(${selectedFilters.price.size})`}
        </button>
        {renderFilterModal('price')}
      </div>

      <div className="filter-group">
        <button
          className={`filter-button ${activeFilter === 'cuisine' ? 'active' : ''}`}
          onClick={() => setActiveFilter(activeFilter === 'cuisine' ? null : 'cuisine')}
        >
          Cuisine {selectedFilters.cuisine.size > 0 && `(${selectedFilters.cuisine.size})`}
        </button>
        {renderFilterModal('cuisine')}
      </div>
    </div>
  );
}