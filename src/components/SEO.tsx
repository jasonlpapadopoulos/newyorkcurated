import Head from 'next/head';
import { useRouter } from 'next/router';

interface SEOProps {
  title: string;
  description: string;
  image?: string;
  type?: string;
  structuredData?: Record<string, any>;
}

function SEO({ 
  title, 
  description,
  image = 'https://images.unsplash.com/photo-1518563172008-e56c5dfbaef6?q=80&w=3087',
  type = 'website',
  structuredData
}: SEOProps) {
  const router = useRouter();
  const canonicalUrl = `https://newyorkcurated.com${router.asPath}`;
  
  const searchTitle = title.length > 60 ? `${title.substring(0, 57)}...` : title;
  const metaDescription = description.length > 160 
    ? `${description.substring(0, 157)}...`
    : description;

  // If no specific structured data is provided, use default website data
  const defaultStructuredData = {
    "@context": "https://schema.org",
    "@type": type === 'article' ? 'Article' : 'WebSite',
    "url": canonicalUrl,
    "name": searchTitle,
    "description": metaDescription,
    "image": image,
    ...(type === 'article' && {
      "datePublished": new Date().toISOString(),
      "author": {
        "@type": "Organization",
        "name": "New York Curated"
      }
    })
  };

  return (
    <Head>
      <title>{searchTitle}</title>
      <meta name="description" content={metaDescription} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Open Graph */}
      <meta property="og:title" content={searchTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content={type} />
      
      {/* Twitter */}
      <meta name="twitter:title" content={searchTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={image} />
      
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData || defaultStructuredData)
        }}
      />
    </Head>
  );
}

export default SEO;