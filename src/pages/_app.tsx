import type { AppProps } from 'next/app';
import { DefaultSeo } from 'next-seo';
import { SEO } from '../../next-seo.config';
import Head from 'next/head';
import Header from '../components/Header';
import '../styles/globals.css';
import '../styles/place.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <DefaultSeo {...SEO} />
      <Head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </Head>
      <Header />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;