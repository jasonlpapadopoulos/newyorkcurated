import type { NextSeoProps } from 'next-seo';

export const SEO: NextSeoProps = {
  defaultTitle: 'New York Curated',
  titleTemplate: '%s | NYC Curated',
  description: 'Discover the best restaurants, bars, and experiences in New York City.',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://newyorkcurated.com/',
    siteName: 'New York Curated',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1518563172008-e56c5dfbaef6?q=80&w=3087',
        width: 1200,
        height: 630,
        alt: 'New York Curated',
      },
    ],
  },
  twitter: {
    handle: '@nycurated',
    site: '@nycurated',
    cardType: 'summary_large_image',
  },
  additionalMetaTags: [
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1',
    },
  ],
};