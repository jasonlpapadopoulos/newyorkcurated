import { useState } from 'react';
import Link from 'next/link';

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
        <Link href="/account">My Account</Link>
        <Link href="/about">About</Link>
      </nav>
    </div>
  );
}

export default SideMenu;