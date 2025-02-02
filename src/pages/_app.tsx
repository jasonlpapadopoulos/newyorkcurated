import type { AppProps } from 'next/app';
import { HelmetProvider } from 'react-helmet-async';
import Head from 'next/head';
import Header from '../components/Header';
import '../styles/globals.css';
import '../styles/place.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <HelmetProvider>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://images.unsplash.com" />
        
        {/* Default meta tags (can be overridden by individual pages) */}
        <meta name="robots" content="index, follow" />
        <meta name="googlebot" content="index, follow" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="NYC Curated" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <Header />
      <Component {...pageProps} />
    </HelmetProvider>
  );
}

export default MyApp;