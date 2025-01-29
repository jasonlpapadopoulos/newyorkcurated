import type { AppProps } from 'next/app';
import { HelmetProvider } from 'react-helmet-async';
import Header from '../components/Header';
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <HelmetProvider>
      <Header />
      <Component {...pageProps} />
    </HelmetProvider>
  );
}

export default MyApp;