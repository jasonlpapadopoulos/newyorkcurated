import type { AppProps } from 'next/app';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { HelmetProvider } from 'react-helmet-async';
import Head from 'next/head';
import Header from '../components/Header';
import Loader from '@/components/Loader';
import { Analytics } from '@vercel/analytics/next';

// Import the main CSS file which now imports all other CSS files
import '../styles/main.css';

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleStart = () => setLoading(true);
    const handleComplete = () => setLoading(false);

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, [router]);

  return (
    <HelmetProvider>
      <Head>
        {/* Basic Meta Tags */}
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        
        {/* SEO Meta Tags */}
        <meta name="robots" content="index, follow" />
        <meta name="googlebot" content="index, follow" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="language" content="English" />
        <meta name="revisit-after" content="7 days" />
        <meta name="author" content="New York Curated" />
        
        {/* Favicon and App Icons */}
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#000000" />
        
        {/* Default Social Meta Tags */}
        <meta property="og:site_name" content="New York Curated" />
        <meta property="og:title" content="New York Curated - The Best of NYC" />
        <meta property="og:description" content="Hand-picked recommendations for the best restaurants, bars, and experiences in New York City." />
        <meta property="og:image" content="https://www.newyorkcurated.com/apple-touch-icon.png" />
        <meta property="og:url" content="https://www.newyorkcurated.com" />
        <meta property="og:type" content="website" />
        
        {/* Structured Data for Organization */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "New York Curated",
            "url": "https://www.newyorkcurated.com",
            "logo": "https://www.newyorkcurated.com/logo.png",
            "description": "Hand-picked recommendations for the best restaurants, bars, and experiences in New York City.",
            "sameAs": [
              "https://twitter.com/newyorkcurated",
              "https://instagram.com/newyorkcurated"
            ]
          })}
        </script>
      </Head>

      {loading && <Loader />}
      <Header />
      <Component {...pageProps} />
      <Analytics />
    </HelmetProvider>
  );
}

export default MyApp;