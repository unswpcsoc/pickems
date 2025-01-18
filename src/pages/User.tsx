import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDoc, doc, Firestore } from "firebase/firestore";  // For fetching data from Firestore
import { getAuth, signOut } from "firebase/auth";  // For logging out the user

type UserPanelProps = {
  db: Firestore; 
};

const auth = getAuth();

const User = ({ db }: UserPanelProps) => {
  const navigate = useNavigate();

  const [userData, setUserData] = useState<{
    name: string;
    email: string;
    score: number;
    rank: number;
  } | null>(null);  // State to hold user data

  const [loading, setLoading] = useState(true);  // Loading state

  useEffect(() => {
    // Fetch user data from Firestore on component mount
    const fetchUserData = async () => {
      if (auth.currentUser) {
        try {
          const userRef = doc(db, "users", auth.currentUser.uid);
          const userDoc = await getDoc(userRef);
          if (userDoc.exists()) {
            setUserData(userDoc.data() as any);
          }
        } catch (error) {
          console.log("Error fetching user data: ", error);
        }
      }
      setLoading(false);
    };

    fetchUserData();
  }, []);

  // Handle Sign Out
  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        navigate('/'); // Redirect to home page after sign out
      })
      .catch((error) => {
        console.error("Error signing out:", error);
      });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!userData) { // Type safety
    return (
      <div>
        <div>No user data available. Please log in.</div>
        <div>
          <button onClick = {handleSignOut}>Sign Out</button>
        </div>
      </div>
    );
  }

  // Blank rank is --th (when the rank is set to -1)
  // Only happens prior to a submitted/processed pickem the user has done
  const displayRank = userData.rank === -1 ? '--' : `${userData.rank}`;
  let verified = "Unverified";
  if (auth.currentUser !== null && auth.currentUser.emailVerified === true) {
    verified = "Verified";
  }


  return (
    <div>
      <h2>User Panel</h2>
      <div className="user-info">
        <p><strong>Name:</strong> {userData.name}</p>
        <p><strong>Email:</strong> {userData.email}</p>
        <p><strong>Email Verification Status:</strong> {verified}</p>
        <p><strong>Score:</strong> {userData.score}</p>
        <p><strong>Rank:</strong> {displayRank}</p>
      </div>
      
      <div>
        <button onClick = {handleSignOut}>Sign Out</button>
      </div>
    </div>
  );
};

export default User;