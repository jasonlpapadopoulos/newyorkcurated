import { NextPage } from 'next';
import Link from 'next/link';
import SEO from '../components/SEO';

const NotFound: NextPage = () => {
  return (
    <>
      <SEO
        title="Page Not Found | New York Curated"
        description="The page you're looking for cannot be found. Explore our curated recommendations for the best of NYC instead."
      />
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-4xl mb-4">Page Not Found</h1>
        <p className="mb-8">The page you're looking for doesn't exist.</p>
        <Link href="/" className="explore-button">
          Back to Home
        </Link>
      </div>
    </>
  );
};

export default NotFound;