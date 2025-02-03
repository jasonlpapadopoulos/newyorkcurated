import { Helmet } from 'react-helmet-async';

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
    const jsonLd = structuredData ? JSON.stringify(structuredData) : null;

    return (
        <Helmet>
            <title>{title}</title>
            <meta name="description" content={description} />
            <meta name="robots" content="index, follow" />
            <link rel="canonical" href={url} />

            {/* Open Graph & Twitter */}
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />
            <meta property="og:url" content={url} />
            <meta property="og:type" content={type} />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />

            {/* JSON-LD Structured Data */}
            {jsonLd && <script type="application/ld+json">{jsonLd}</script>}
        </Helmet>
    );
}
