import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { app } from './firebase';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { Home, Admin, User, Signup, Login, PasswordReset, PasswordForgot, Pickem, Leaderboard } from './pages';
import { Header, Footer } from './components';

const auth = getAuth(app);
const db = getFirestore(app);

function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isContentLarge, setIsContentLarge] = useState<boolean>(false);  // To track content height
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    // Check if content height exceeds viewport height
    const checkContentHeight = () => {
      const contentHeight = document.body.scrollHeight;
      const viewportHeight = window.innerHeight;
      setIsContentLarge(contentHeight > viewportHeight);
    };

    // Initial check and setup resize listener
    checkContentHeight();
    window.addEventListener('resize', checkContentHeight);

    return () => {
      window.removeEventListener('resize', checkContentHeight);
      unsubscribe();
    };
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <header>
        <Header user={user} />
      </header>

      <main style={{ minHeight: '100vh' }}>  {/* Ensure the main content area is at least 100vh */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/admin"
            element={(user && user.emailVerified) ? <Admin db={db} /> : <Login />}
          />
          <Route
            path="/user"
            element={user ? <User db={db} /> : <Login />}
          />
          <Route
            path="/pickems"
            element={(user && user.emailVerified) ? <Pickem db={db} /> : <Login />}
          />
          <Route
            path="/leaderboard"
            element={(user && user.emailVerified) ? <Leaderboard db={db} /> : <Login />}
          />
          {!user && (
            <>
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login />} />
              <Route path="/password-forgot" element={<PasswordForgot />} />
              <Route path="/password-reset" element={<PasswordReset />} />
            </>
          )}
        </Routes>
      </main>

      <Footer isLargeContent={isContentLarge} />  {/* Pass the flag to Footer */}
    </div>
  );
}

export default App;
