import { useEffect, useState } from 'react';
import { auth } from '../lib/firebase';
import { useRouter } from 'next/router';
import type { UserData } from '../types/user';

export default function AccountPage() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const router = useRouter();

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

  const currentTime = new Date().toLocaleTimeString('en-US', { timeZone: 'America/New_York' });

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
      <div className="account-p">The time is currently {currentTime} in New York City.</div>
      <div className="account-button" onClick={handleLogout}>Logout</div>
    </div>
  );
}