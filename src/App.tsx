import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { auth } from './firebase/index';
import { getIdTokenResult, onAuthStateChanged } from "firebase/auth";
import { Home, Admin, User, Signup, Login, PasswordReset, PasswordForgot, Pickem, Leaderboard, InfoAndPrize } from './pages';
import { Header, Footer, EmailVerificationAlert } from './components';

function App() {
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false); // Track user admin status
  const [loading, setLoading] = useState<boolean>(true);
  const [isContentLarge, setIsContentLarge] = useState<boolean>(false);  // To track content height

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        currentUser.getIdToken(true)  // Force refresh the ID token
        .then((idToken) => {
          getIdTokenResult(currentUser)
            .then((idTokenResult) => {
              setIsAdmin(Boolean(idTokenResult.claims.admin));
              console.log(idTokenResult.claims.admin, "pass!");
            })
            .catch((error) => {
              console.error("Error fetching custom claims:", error);
            });
        })
        .catch((error) => {
          console.error("Error refreshing ID token:", error);
        });
      } else {
        setUser(null);
        setIsAdmin(false);
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
        <Header user={user} isAdmin={isAdmin} />
      </header>
      {user && (<EmailVerificationAlert verified={user.emailVerified as boolean} />)}

      <main style={{ minHeight: '100vh' }}>  {/* Ensure the main content area is at least 100vh */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/InfoAndPrize" element={<InfoAndPrize />} />
          <Route
            path="/admin"
            element={(user && user.emailVerified && isAdmin) ? <Admin /> : <Home />}
          />
          <Route
            path="/user"
            element={user ? <User /> : <Login />}
          />
          <Route
            path="/pickems"
            element={(user && user.emailVerified) ? <Pickem /> : <Login />}
          />
          <Route
            path="/leaderboard"
            element={(user && user.emailVerified) ? <Leaderboard /> : <Login />}
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
