import { useState, useEffect } from 'react';
import { auth } from '../lib/firebase';

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBookmarks = async () => {
    setIsLoading(true);
    const user = auth.currentUser;
    if (user) {
      try {
        const response = await fetch(`/api/bookmarks?firebase_uid=${user.uid}`);
        const data = await response.json();
        setBookmarks(data);
      } catch (error) {
        console.error('Error fetching bookmarks:', error);
      }
    }
    setIsLoading(false);
  };

  const toggleBookmark = async (placeId: string, placeType: 'food' | 'drink') => {
    const user = auth.currentUser;
    if (!user) return;

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
    return bookmarks.some(bookmark => bookmark.place_id === placeId && bookmark.saved === 1);
  };

  useEffect(() => {
    fetchBookmarks();
  }, []);

  return {
    bookmarks,
    isLoading,
    toggleBookmark,
    isPlaceBookmarked,
    refreshBookmarks: fetchBookmarks,
  };
}