import { useEffect, useState } from 'react';
import { auth } from '../lib/firebase';
import { useRouter } from 'next/router';
import type { UserData } from '../types/user';
import Link from 'next/link';
import { useBookmarks } from '../hooks/useBookmarks';

export default function AccountPage() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isUserLoading, setIsUserLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'food' | 'drink'>('all');
  const router = useRouter();
  const { bookmarks, isLoading: isBookmarksLoading } = useBookmarks();

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
        router.push('/auth');
      }
      setIsUserLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  if (isUserLoading || isBookmarksLoading) {
    return <p>Loading...</p>;
  }

  if (!userData) {
    return null;
  }

  const currentTime = new Date().toLocaleString('en-US', {
    // hour: 'numeric',
    // minute: '2-digit',
    // hour12: true,
    weekday: 'long'
  });

  const handleLogout = async () => {
    try {
      await auth.signOut();
      router.push('/auth');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const filteredBookmarks = bookmarks.filter((place) => {
    if (filter === 'all') return true;
    return place.place_type === filter;
  });

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
      <h2>Saved Places</h2>
      <div className="saved-places-filter-container">
      <button className={`saved-places-filter-button all ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>All</button>
  <button className={`saved-places-filter-button food ${filter === 'food' ? 'active' : ''}`} onClick={() => setFilter('food')}>Food</button>
  <button className={`saved-places-filter-button drink ${filter === 'drink' ? 'active' : ''}`} onClick={() => setFilter('drink')}>Drinks</button>
      </div>
      <div className="saved-places-section">
        {isBookmarksLoading ? (
          <p>Loading your saved places...</p>
        ) : filteredBookmarks.length === 0 ? (
          <div className="empty-state">
            <p>You haven't saved any places yet.</p>
            {/* <Link href="/what-are-you-looking-for" className="explore-button">
              Start Exploring
            </Link> */}
          </div>
        ) : (
          <div className="bookmarks-container">
            {filteredBookmarks.map((place) => (
              <div key={`${place.place_type}-${place.place_id}`} className="place-card">
                <Link href={`/place/${place.neighborhood_clean}/${place.place_name_clean}`}>
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
      </div>
      <div className="account-button" onClick={handleLogout}>Logout</div>
    </div>
  );
}
