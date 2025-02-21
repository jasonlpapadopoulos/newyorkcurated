import { useState, useEffect } from 'react';
import { auth } from '../lib/firebase';

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBookmarks = async () => {
    console.log('Fetching bookmarks...');
    setIsLoading(true);
    const user = auth.currentUser;
    // console.log('Current user:', user?.uid);
    
    if (user) {
      try {
        const response = await fetch(`/api/bookmarks?firebase_uid=${user.uid}`);
        const data = await response.json();
        // console.log('Fetched bookmarks:', data);
        setBookmarks(data);
      } catch (error) {
        console.error('Error fetching bookmarks:', error);
      }
    } else {
      console.log('No user found when fetching bookmarks');
    }
    setIsLoading(false);
  };

  useEffect(() => {
    // Wait for Firebase auth to initialize
    const unsubscribe = auth.onAuthStateChanged((user) => {
      console.log('Auth state changed. User:', user?.uid);
      if (user) {
        fetchBookmarks();
      } else {
        setBookmarks([]);
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []); // Empty dependency array since we're using auth.onAuthStateChanged

  const toggleBookmark = async (placeId: string, placeType: string) => {
    const user = auth.currentUser;
    if (!user) {
      console.log('No user found when toggling bookmark');
      return false;
    }

    try {
      const response = await fetch('/api/bookmarks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firebase_uid: user.uid,
          place_id: placeId,
          place_type: placeType,
        }),
      });

      if (response.ok) {
        // Refresh bookmarks after toggling
        await fetchBookmarks();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      return false;
    }
  };

  const isPlaceBookmarked = (placeId: string) => {
    console.log('Checking if place is bookmarked:', placeId);
    console.log('Current bookmarks:', bookmarks);
    return bookmarks.some(bookmark => bookmark.place_id === placeId && bookmark.saved === 1);
  };

  return {
    bookmarks,
    isLoading,
    toggleBookmark,
    isPlaceBookmarked,
    refreshBookmarks: fetchBookmarks,
  };
}