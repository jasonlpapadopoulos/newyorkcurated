import { useEffect, useState } from 'react';
import { auth } from '../lib/firebase';
import { useRouter } from 'next/router';
import type { UserData } from '../types/user';
import Link from 'next/link';
import { useBookmarks } from '../hooks/useBookmarks';
import { ArrowRight, MapPin, Search } from 'lucide-react';

export default function AccountPage() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isUserLoading, setIsUserLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'food' | 'drinks' | 'coffee' | 'party'>('all');
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
    return (
      <div className="account-container">
        <div className="saved-places-loading">
          <div className="saved-places-loading-spinner"></div>
        </div>
      </div>
    );
  }

  if (!userData) {
    return null;
  }

  const currentTime = new Date().toLocaleString('en-US', {
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

  const getCategoryColor = (type: string) => {
    switch(type) {
      case 'food': return 'food';
      case 'drinks': return 'drinks';
      case 'coffee': return 'coffee';
      case 'party': return 'party';
      default: return 'food';
    }
  };

  return (
    <div className="account-container">
      <h1>Hey {userData.first_name}!</h1>
      <div className="account-p">It's {currentTime} in New York City.</div>
      <div className="account-p">What are you up to?</div>
      <div className="button-container">
        <Link href="/categories" className="explore-button">
          Explore
        </Link>
      </div>
  
      <div className="saved-places-container">
        <div className="saved-places-header">
          <h2 className="saved-places-title">Saved Places</h2>
        </div>
        
        <div className="saved-places-filter-container">
          <button className={`saved-places-filter-button all ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>All</button>
          <button className={`saved-places-filter-button food ${filter === 'food' ? 'active' : ''}`} onClick={() => setFilter('food')}>Food</button>
          <button className={`saved-places-filter-button drinks ${filter === 'drinks' ? 'active' : ''}`} onClick={() => setFilter('drinks')}>Drinks</button>
          <button className={`saved-places-filter-button coffee ${filter === 'coffee' ? 'active' : ''}`} onClick={() => setFilter('coffee')}>Coffee</button>
          <button className={`saved-places-filter-button party ${filter === 'party' ? 'active' : ''}`} onClick={() => setFilter('party')}>Party</button>
        </div>
  
        {isBookmarksLoading ? (
          <div className="saved-places-loading">
            <div className="saved-places-loading-spinner"></div>
          </div>
        ) : filteredBookmarks.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📍</div>
            <p className="empty-state-text">You haven't saved any places yet.</p>
            <Link href="/categories" className="empty-state-button">
              Discover Places
            </Link>
          </div>
        ) : (
          <div className="saved-places-grid">
            {filteredBookmarks.map((place) => (
              <div key={`${place.place_type}-${place.place_id}`} className="saved-place-card">
                <Link href={`/place/${place.neighborhood_clean}/${place.place_name_clean}`}>
                  <div className="saved-place-image-container">
                    <img 
                      src={place.image_url} 
                      alt={place.place_name}
                      className="saved-place-image"
                    />
                    <div className={`saved-place-category-tag ${getCategoryColor(place.place_type)}`}>
                      {place.place_type}
                    </div>
                  </div>
                  <div className="saved-place-content">
                    <h3 className="saved-place-title">{place.place_name}</h3>
                    <div className="saved-place-details">
                      <div className="saved-place-meta">
                        {/* <MapPin size={14} /> */}
                        <span>{place.neighborhood}</span>
                        {place.cuisine && (
                          <>
                            <span>•</span>
                            <span className="saved-place-cuisine">{place.cuisine}</span>
                          </>
                        )}
                        {place.budget && (
                          <>
                            <span>•</span>
                            <span className="saved-place-budget">{place.budget}</span>
                          </>
                        )}
                      </div>
                      <div className="saved-place-actions">
                        <span className="saved-place-view-button">
                          More <ArrowRight size={14} />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
  
      <button className="account-button" onClick={handleLogout}>Logout</button>
    </div>
  );
}