import { NextSeo } from 'next-seo';

interface SEOProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: string;
  slogan?: string;
  structuredData?: object;
}

export default function SEO({ 
  title, 
  description,
  slogan = "The best things to do in New York. Handpicked, like upstate apples.",
  image = 'https://images.unsplash.com/photo-1518563172008-e56c5dfbaef6?q=80&w=3087',
  url = 'https://newyorkcurated.com',
  type = 'website',
  structuredData
}: SEOProps) {
  return (
    <NextSeo
      title={title}
      description={description}
      canonical={url}
      openGraph={{
        url,
        title,
        description,
        images: [
          {
            url: image,
            width: 1200,
            height: 630,
            alt: title,
          },
        ],
        siteName: 'New York Curated',
        type,
      }}
      additionalLinkTags={[
        {
          rel: 'icon',
          href: '/favicon.ico',
        },
        {
          rel: 'apple-touch-icon',
          href: '/apple-touch-icon.png',
        }
      ]}
      {...(structuredData && {
        additionalMetaTags: [{
          property: 'script',
          content: JSON.stringify(structuredData),
          keyOverride: 'structured-data'
        }]
      })}
    />
  );
}