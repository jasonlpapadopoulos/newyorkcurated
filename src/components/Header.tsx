import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Menu } from 'lucide-react';
import SideMenu from './SideMenu';

const Header: React.FC = () => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (router.pathname === '/') {
    return null; // Don't render the header on the homepage
  }

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <div className="site-header">
      <div className="site-header-content">
        <div className="header-top">
          <div className="banner">
            <Link href="/">nyCurated</Link>
          </div>
          <button onClick={toggleMenu} className="menu-button">
            <Menu size={28} />
          </button>
        </div>
      </div>
      <div className="header-bottom-line"></div>
      <SideMenu isOpen={isMenuOpen} toggleMenu={toggleMenu} />
    </div>
  );
};

export default Header;
