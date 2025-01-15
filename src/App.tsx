// src/App.tsx
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
// import Admin from './pages/Admin';
// import User from './pages/User';
import { Home, Admin, User} from './pages';
import { Navbar } from './components';

// import AdminPanel from './components/AdminPanel';
// import UserPanel from './components/UserPanel';

// Define types for teams and matches
type Match = {
  team1: string;
  team2: string;
  userPick: string | null;
};

function App() {
  const [teams, setTeams] = useState<string[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);

  return (
    <Router>
      <header>
        <Navbar/>
      </header>

      <main>
        <Routes>
          <Route path = "/" element={<Home />} />
          <Route path = "/admin" element={<Admin teams={teams} setTeams={setTeams} matches={matches} setMatches={setMatches} />} />
          <Route path = "/user" element={<User teams={teams} matches={matches} />} />
        </Routes>
      </main>

    </Router>
    // Later on add Guest Route and Auth Route !!




    // <div className="App">
    //   <h1>Pick'em System</h1>

    //   {/* Admin Panel */}
    //   <AdminPanel teams={teams} setTeams={setTeams} matches={matches} setMatches={setMatches} />
      
    //   {/* User Panel */}
    //   <UserPanel teams={teams} matches={matches} />
    // </div>
  );
}

export default App;