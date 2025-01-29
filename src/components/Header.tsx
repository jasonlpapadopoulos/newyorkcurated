import { useRouter } from 'next/router';
import Link from 'next/link';

function Header() {
  const router = useRouter();
  
  // Don't render the header on the homepage
  if (router.pathname === '/') {
    return null;
  }

  return (
    <div className="site-header">
      <div className="site-header-content">
        <div className="header-top">
          <div className="banner">
            <Link href="/">nyCurated</Link>
          </div>
        </div>
      </div>
      <div className="header-bottom-line"></div>
    </div>
  );
}

export default Header;