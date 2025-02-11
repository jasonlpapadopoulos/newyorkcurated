import type { AppProps } from 'next/app';
import { HelmetProvider } from 'react-helmet-async';
import Head from 'next/head';
import Header from '../components/Header';
import '../styles/globals.css';
import '../styles/place.css';
import '../styles/about.css';
import '../styles/Header.css';
import '../styles/SideMenu.css';
import '../styles/neighborhood.css'; // Add this line

function MyApp({ Component, pageProps }: AppProps) {
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
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@newyorkcurated" />
        
        {/* Structured Data for Organization */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "New York Curated",
            "url": "https://newyorkcurated.com",
            "logo": "https://newyorkcurated.com/logo.png",
            "description": "Hand-picked recommendations for the best restaurants, bars, and experiences in New York City.",
            "sameAs": [
              "https://twitter.com/newyorkcurated",
              "https://instagram.com/newyorkcurated"
            ]
          })}
        </script>
      </Head>
      <Header />
      <Component {...pageProps} />
    </HelmetProvider>
  );
}

export default MyApp;