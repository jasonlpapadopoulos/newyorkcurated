import { useState } from 'react';
import { auth } from '../lib/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/router';

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // State to store error messages
  const router = useRouter();

  const handleAuth = async () => {
    setErrorMessage(''); // Clear previous errors

    try {
      if (!email || !password || (isSignUp && !firstName)) {
        setErrorMessage('Please fill in all fields.');
        return;
      }

      if (isSignUp) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await fetch('/api/user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            firebase_uid: user.uid,
            email: user.email,
            first_name: firstName,
          }),
        });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }

      router.push('/account'); // Redirect after login/signup
    } catch (error) {
      console.error('Authentication error:', error);
      handleFirebaseError(error);
    }
  };

  const handleFirebaseError = (error: any) => {
    switch (error.code) {
      case 'auth/email-already-in-use':
        setErrorMessage('This email is already in use. Please log in or reset your password.');
        break;
      case 'auth/invalid-email':
        setErrorMessage('Invalid email format.');
        break;
      case 'auth/weak-password':
        setErrorMessage('Password must be at least 6 characters.');
        break;
      case 'auth/user-not-found':
        setErrorMessage('No account found with this email.');
        break;
      case 'auth/wrong-password':
        setErrorMessage('Incorrect password.');
        break;
      case 'auth/too-many-requests':
        setErrorMessage('Too many failed login attempts. Try again later.');
        break;
      case 'auth/invalid-credential':
          setErrorMessage('Incorrect email or password.');
          break;
      default:
        setErrorMessage('An error occurred. Please try again.');
    }
  };

  return (
    <div className="auth-container">
      <h1>{isSignUp ? 'Sign Up' : 'Welcome Back!'}</h1>
      {isSignUp && (
        <input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
      )}
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />

      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <div className="auth-button" onClick={handleAuth}>
        {isSignUp ? 'Sign Up' : 'Login'}
      </div>

      <div className="auth-p" onClick={() => setIsSignUp(!isSignUp)}>
        {isSignUp ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
      </div>
    </div>
  );
}
