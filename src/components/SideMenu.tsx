import { useState } from 'react';
import { Link } from 'react-router-dom';

function SideMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`side-menu ${isOpen ? 'open' : ''}`}>
      <button 
        className="menu-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        <div className="hamburger">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </button>
      <nav className="menu-content">
        <Link to="/account">My Account</Link>
        <Link to="/about">About</Link>
      </nav>
    </div>
  );
}

export default SideMenu;