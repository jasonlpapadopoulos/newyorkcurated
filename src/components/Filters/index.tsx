import { useState } from 'react';

interface FiltersProps {
  category: string;
  selectedFilters: {
    meals: Set<string>;
    price: Set<string>;
    cuisine: Set<string>;
    bar_category: Set<string>;
    entrance: Set<string>;
    difficulty_getting_in: Set<string>;
  };
  onFilterChange: (filters: any) => void;
  availableCuisines?: string[];
  availableBarCategories?: string[];
  availableEntranceTypes?: string[];
  availableDifficultyLevels?: string[];
}

const filterConfig: Record<string, string[]> = {
  food: ["meals", "price", "cuisine"],
  drinks: ["price", "bar_category"],
  coffee: ["price"],  
  party: ["price", "entrance", "difficulty_getting_in"]
};

const titles: Record<string, string> = {
  meals: "Meal",
  price: "Price Range",
  cuisine: "Cuisine",
  bar_category: "Setting",
  entrance: "Entrance Type",
  difficulty_getting_in: "Getting In"
};

export default function Filters({ 
  category, 
  selectedFilters, 
  onFilterChange, 
  availableCuisines = [],
  availableBarCategories = [],
  availableEntranceTypes = [],
  availableDifficultyLevels = []
}: FiltersProps) {
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
      meals: [
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
      cuisine: availableCuisines.map(cuisine => ({
        value: cuisine.toLowerCase(),
        label: cuisine
      })),
      bar_category: availableBarCategories.map(bar_category => ({
        value: bar_category.toLowerCase(),
        label: bar_category
      })),
      entrance: availableEntranceTypes.map(entrance => ({
        value: entrance.toLowerCase(),
        label: entrance
      })),
      difficulty_getting_in: availableDifficultyLevels.map(difficulty => ({
        value: difficulty.toLowerCase(),
        label: difficulty
      }))
    };
    
    return (
      <>
        <div 
          className={`modal-backdrop ${activeFilter === type ? 'show' : ''}`}
          onClick={closeModal}
        />
        <div className={`filter-modal ${activeFilter === type ? 'show' : ''}`}>
          <div className="filter-modal-header">
            <span className="filter-modal-title">{titles[type]}</span>
            <button className="filter-modal-close" onClick={closeModal}>×</button>
          </div>
          {options[type as keyof typeof options]?.map(({ value, label }) => (
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
      {filterConfig[category]?.map((filterType) => (
        <div key={filterType} className="filter-group">
          <button
            className={`filter-button ${activeFilter === filterType ? 'active' : ''}`}
            onClick={() => setActiveFilter(activeFilter === filterType ? null : filterType)}
          >
            {titles[filterType]} 
            {selectedFilters[filterType as keyof typeof selectedFilters].size > 0 && 
              ` (${selectedFilters[filterType as keyof typeof selectedFilters].size})`}
          </button>
          {renderFilterModal(filterType)}
        </div>
      ))}
    </div>
  );
}