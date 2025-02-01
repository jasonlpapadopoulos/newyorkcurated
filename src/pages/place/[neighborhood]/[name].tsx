import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const PlacePage = () => {
  const router = useRouter();
  const { neighborhood, name } = router.query;
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!neighborhood || !name) return;

      try {
        console.log('Fetching data for:', { neighborhood, name });
        const response = await fetch(`/api/places?neighborhood=${neighborhood}&name=${name}`);
        console.log('Response status:', response.status);
        
        const json = await response.json();
        console.log('Response data:', json);
        
        if (!response.ok) {
          throw new Error(json.error || 'Failed to fetch data');
        }
        
        setData(json);
      } catch (err) {
        console.error('Error:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [neighborhood, name]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <div>
        <h1>Error</h1>
        <p>{error}</p>
        <pre>{JSON.stringify({ neighborhood, name }, null, 2)}</pre>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Raw API Response</h1>
      <h2>Query Parameters:</h2>
      <pre>{JSON.stringify({ neighborhood, name }, null, 2)}</pre>
      <h2>Data:</h2>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default PlacePage;