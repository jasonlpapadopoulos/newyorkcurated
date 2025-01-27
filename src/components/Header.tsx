import { Link, useLocation } from 'react-router-dom';

function Header() {
  const location = useLocation();
  
  // Don't render the header on the homepage
  if (location.pathname === '/') {
    return null;
  }

  return (
    <div className="site-header">
      <div className="site-header-content">
        <div className="header-top">
          <div className="banner">
            <Link to="/">nyCurated</Link>
          </div>
        </div>
      </div>
      <div className="header-bottom-line"></div>
    </div>
  );
}

export default Header;