import { useEffect, useState } from 'react';
import { auth } from '../lib/firebase';
import { useRouter } from 'next/router';
import type { UserData } from '../types/user';
import Link from 'next/link';
import { useBookmarks } from '../hooks/useBookmarks';

const generatePlaceUrl = (place: any) => {
  // Replace spaces and special characters with hyphens, convert to lowercase
  const nameSlug = place.place_name_clean;
  const neighborhoodSlug = place.neighborhood_clean;
  return `/places/${neighborhoodSlug}/${nameSlug}`;
};

export default function AccountPage() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const router = useRouter();
  const { bookmarks, isLoading } = useBookmarks();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const response = await fetch(`/api/user?firebase_uid=${user.uid}`);
          const data = await response.json();
          setUserData(data);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        router.push('/auth'); // Redirect to login if no session found
      }
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, [router]);

  if (!userData) return <p>Loading...</p>;

  const currentTime = new Date().toLocaleString('en-US', {
    // timeZone: 'America/New_York',
    // weekday: 'long',
    // year: 'numeric',
    // month: 'long',
    // day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  const handleLogout = async () => {
    try {
      await auth.signOut();
      router.push('/auth'); // Redirect to login after logout
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="account-container">
      <h1>Hey {userData.first_name}!</h1>
      <div className="account-p">It's {currentTime} in New York City.</div>
      <div className="account-p">What are you up to?</div>
      <div className="button-container">
        <Link href="/what-are-you-looking-for" className="explore-button">
          Explore
        </Link>
      </div>

      <section className="saved-places-section">
        <h2>Saved Places</h2>
        {isLoading ? (
          <p>Loading your saved places...</p>
        ) : bookmarks.length === 0 ? (
          <div className="empty-state">
            <p>You haven't saved any places yet.</p>
            <Link href="/what-are-you-looking-for" className="explore-button">
              Start Exploring
            </Link>
          </div>
        ) : (
          <div className="bookmarks-container">
            {bookmarks.map((place) => (
              <div key={`${place.place_type}-${place.place_id}`} className="place-card">
                <Link href={generatePlaceUrl(place)}>
                  <img 
                    src={place.image_url} 
                    alt={place.place_name}
                    className="place-card-image"
                  />
                  <div className="place-card-content">
                    <h3 className="place-card-title">{place.place_name}</h3>
                    {place.cuisine && (
                      <p className="place-card-cuisine">{place.cuisine}</p>
                    )}
                    <p className="place-card-budget">{place.budget}</p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>

      <div className="account-button" onClick={handleLogout}>Logout</div>
    </div>
  );
}
