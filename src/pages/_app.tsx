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
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Header />
      <Component {...pageProps} />
    </HelmetProvider>
  );
}

export default MyApp;