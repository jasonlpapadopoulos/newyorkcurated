import Head from 'next/head';

interface SEOProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: string;
  slogan?: string;
}

export default function SEO({ 
  title, 
  description,
  slogan = "The best things to do in New York. Handpicked, like upstate apples.", 
  image = 'https://images.unsplash.com/photo-1518563172008-e56c5dfbaef6?q=80&w=3087',
  url = 'https://newyorkcurated.com',
  type = 'website'
}: SEOProps) {
  // Create a shorter title for search results
  const searchTitle = title.includes('-') ? title.split('-')[0].trim() : title;
  
  // Combine description with slogan for homepage
  const fullDescription = url === 'https://newyorkcurated.com' 
    ? slogan 
    : description;

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={fullDescription} />
      
      {/* Search Engine Title Tag */}
      <meta name="title" content={searchTitle} />
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={fullDescription} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="New York Curated" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={fullDescription} />
      <meta name="twitter:image" content={image} />
      
      {/* Additional SEO tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={url} />
    </Head>
  );
}