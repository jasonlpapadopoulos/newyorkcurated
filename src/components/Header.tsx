import { Link } from 'react-router-dom';

function Header() {
  return (
    <div className="site-header">
      <div className="site-header-content">
        <div className="header-top">
          <div className="banner">
            <Link to="/">Plana</Link>
          </div>
          <Link to="/account" className="account-section">
            <span>👤</span>
            Account
          </Link>
        </div>
      </div>
      <div className="header-bottom-line"></div>
    </div>
  );
}

export default Header;