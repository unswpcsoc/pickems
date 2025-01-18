// src/App.tsx
import { useState, useEffect } from 'react';
import { /*BrowserRouter as Router,*/ Routes, Route, /*Link,*/ useNavigate  } from 'react-router-dom'
import { app } from './firebase';
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { Firestore, getFirestore } from "firebase/firestore";

import { Home, Admin, User, Signup, Login, PasswordReset, PasswordForgot, Pickem } from './pages';
import { Navbar } from './components';

// Define types for teams and matches
type Match = {
  team1: string;
  team2: string;
  userPick: string | null;
};

const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

function App() {
  const [user, setUser] = useState<any>(null);  // Store authenticated user
  const [loading, setLoading] = useState<boolean>(true);  // Loading state (since stuff is running async)
  const navigate = useNavigate();

  useEffect(() => {
    // Firebase Auth state change listener
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser); // Set user if logged in
      } else {
        setUser(null); // Clear user if logged out
      }
      setLoading(false);
    });

    return () => unsubscribe(); // Cleanup listener on component unmount
  }, []);

  if (loading) {
    return <div>Loading...</div>;  // Display loading indicator while checking auth state (will go to the main return after async runs)
  }

  return (
    <div>
      <header>
        <Navbar user = {user}/>
      </header>

      <main>
        <Routes>
          <Route path = "/" element={<Home />} />

          {/* Protected routes: Only accessible after logged in and verified */}
          {/* ADMIN ROUTE SHOULD ONLY BE ACCESSED BY MOD/ADMIN CORRECT LATER */}
          <Route
            path = "/admin"
            element = {(user && user.emailVerified) ? <Admin db = {db} /> : <Login />}
          />

          <Route
            path = "/user"
            element = {user ? <User db = {db} /> : <Login />}
          />
          <Route
            path = "/pickems"
            element = {(user && user.emailVerified) ? <Pickem db = {db} /> : <Login />}
          />

          {/* Auth/login Routes: only available if the user is not logged in */}
          {!user && (
            <>
              <Route path = "/signup" element = {<Signup />} />
              <Route path = "/login" element = {<Login />} />
              <Route path = "/password-forgot" element = {<PasswordForgot />} />
              <Route path = "/password-reset" element = {<PasswordReset />} />
            </>
          )}
        </Routes>
      </main>
    </div>
    
  );
}

export default App;