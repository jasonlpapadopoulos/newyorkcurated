import { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, ChevronDown, ChevronUp } from 'lucide-react';
import type { Neighborhood } from '../types/neighborhood';
import Loader from '../components/Loader';


interface SideMenuProps {
  isOpen: boolean;
  toggleMenu: () => void;
}

const SideMenu: React.FC<SideMenuProps> = ({ isOpen, toggleMenu }) => {
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Control expanded menus
  const [isNeighborhoodsOpen, setIsNeighborhoodsOpen] = useState(false);
  const [expandedBoroughs, setExpandedBoroughs] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (isOpen && neighborhoods.length === 0) {
      fetchNeighborhoods();
    }
  }, [isOpen]);

  useEffect(() => {
    if (loading) {
      setTimeout(() => setLoading(false), 1000);
    }
  }, [loading]);
  

  const fetchNeighborhoods = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/neighborhoods');
      if (!response.ok) throw new Error('Failed to load neighborhoods');
      const data = await response.json();
      setNeighborhoods(data);
    } catch (err) {
      setError('Unable to load neighborhoods.');
    } finally {
      setLoading(false);
    }
  };

  // Group neighborhoods by borough
  const groupedNeighborhoods = neighborhoods.reduce((acc: Record<string, Neighborhood[]>, neighborhood) => {
    acc[neighborhood.borough] = acc[neighborhood.borough] || [];
    acc[neighborhood.borough].push(neighborhood);
    return acc;
  }, {});

  const toggleNeighborhoods = () => setIsNeighborhoodsOpen(!isNeighborhoodsOpen);
  const toggleBorough = (borough: string) => {
    setExpandedBoroughs(prev => ({ ...prev, [borough]: !prev[borough] }));
  };

  return (
    <div className={`side-menu ${isOpen ? 'open' : ''}`}>
      <div className="side-menu-header">
        <h2>Menu</h2>
        <button onClick={toggleMenu} className="close-button">
          <X size={28} />
        </button>
      </div>

      <nav className="side-menu-links">
      {loading && <div className="loader">Loading...</div>}
        <Link className="menu-item" href="/" onClick={toggleMenu}>Home</Link>
        <Link className="menu-item" href="/account" onClick={toggleMenu}>My Profile</Link>
        <Link className="menu-item" href="/about" onClick={toggleMenu}>About</Link>
        <Link className="menu-item" href="/categories" onClick={toggleMenu}>Explore</Link>

        {/* Neighborhoods Main Menu */}
        <div className="menu-item" onClick={toggleNeighborhoods}>
          <span>Neighborhoods</span>
          {isNeighborhoodsOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>

        {/* Nested Boroughs */}
        {isNeighborhoodsOpen && (
          <div className="nested-links">
            {loading && <p>Loading neighborhoods...</p>}
            {error && <p>{error}</p>}
            {!loading && !error && Object.keys(groupedNeighborhoods).map((borough) => (
              <div key={borough}>
                <div className="menu-item" onClick={() => toggleBorough(borough)}>
                  <span>{borough}</span>
                  {expandedBoroughs[borough] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
                {expandedBoroughs[borough] && (
                  <div className="nested-links deeper-nested-links">
                    {groupedNeighborhoods[borough].map((neighborhood) => (
                      <Link 
                        key={neighborhood.value} 
                        href={`/neighborhood/${neighborhood.value}`} 
                        onClick={() => { setLoading(true); toggleMenu(); }}
                      >
                        {neighborhood.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        <Link className="menu-item" href="/terms" onClick={toggleMenu}>Terms of Use</Link>
        
      </nav>
    </div>
  );
};

export default SideMenu;