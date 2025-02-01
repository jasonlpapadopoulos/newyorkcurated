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
        <link rel="icon" href="/favicon.ico" sizes="any" />
        {/* <link rel="icon" href="/favicon.svg" type="image/svg+xml" /> */}
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </Head>
      <Header />
      <Component {...pageProps} />
    </HelmetProvider>
  );
}

export default MyApp;