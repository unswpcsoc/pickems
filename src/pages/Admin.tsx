// src/components/AdminPanel.tsx
import { useState, useEffect } from 'react';
import { TypesOfMatches } from "../defines";
import { rank_users } from "../utils";

import { getAuth } from "firebase/auth";
import { collection, query, getDocs, Firestore, Timestamp, doc, getDoc, updateDoc, setDoc, onSnapshot, orderBy } from "firebase/firestore";  //REMOVE IF MAKING database.tsx
import { addTeamToDatabase, addMatchToDatabase } from "../firebase/database"; 
import { getStorage, ref } from "firebase/storage";

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { teamCard } from "../components"
import DataTable from 'react-data-table-component';
function isOpen(match: any) {
  return match.open && match.closeTime.seconds > Date.now() / 1000;
}
const auth = getAuth();
const storage = getStorage();

type UserPanelProps = {
  db: Firestore; 
};


const Admin = ({ db }: UserPanelProps) => {
  // States for forms/input when making teams and matches
  const [teamName, setTeamName] = useState<string>('');
  const [formData, setFormData] = useState({
    matchTeam1: '',
    matchTeam2: '',
    category: '',
    points: '',
    closeTime: ''
  });

  // States for team and match display
  const [teamOptions, setTeamOptions] = useState<{ name: string, id: string }[]>([]);
  const [matches, setMatches] = useState<{ matchId: string, team1Id: string, team2Id: string, category: string, points: string, closeTime: Timestamp, open: boolean, winner: number }[]>([]); // Matches state
  const [teams, setTeams] = useState<Map<string, string>>(new Map());

  // Using snapshot to update both teams and matches on server update
  useEffect(() => {
    const fetchTeams = onSnapshot(doc(db, "teams", "teamData"), (docSnapshot) => {
      if (docSnapshot.exists()) {
        const teamsData = docSnapshot.data();
        const teamsList = Object.keys(teamsData).map(id => ({
          name: teamsData[id].name,
          id: id,
        }));
        setTeamOptions(teamsList);
      }
    }, (error) => {
      console.error("Error fetching teams: ", error);
    });

    // Set up the real-time listeners
    const fetchMatches = onSnapshot(doc(db, 'matches', 'matchData'), (docSnapshot) => {
      if (docSnapshot.exists()) {
        const matchesData = docSnapshot.data();
        let matchList = Object.keys(matchesData).map((id) => ({
          matchId: matchesData[id].matchId,
          team1Id: matchesData[id].team1Id,
          team2Id: matchesData[id].team2Id,
          category: matchesData[id].category,
          points: matchesData[id].points,
          closeTime: matchesData[id].closeTime,
          open: matchesData[id].open,
          winner: matchesData[id].winner,
        }));

        matchList = matchList.sort((a, b) => 
          a.closeTime.seconds - b.closeTime.seconds
        );
        setMatches(matchList);
      }
    }, (error) => {
      console.error("Error listening to matches: ", error);
    });

    const unsubscribeTeams = onSnapshot(doc(db, 'teams', "teamData"), (docSnapshot) => {
      if (docSnapshot.exists()) {
        const teamsData = docSnapshot.data();
        const teamMap = new Map<string, string>(); // Create a Map to store team names by their IDs
        Object.keys(teamsData).forEach((id) => {
          teamMap.set(id, teamsData[id].name);
        });

        console.log(teamMap)

        setTeams(teamMap);
      }
    });

    // Clean up the listener when the component unmounts
    return () => {
      fetchTeams();
      fetchMatches();
      unsubscribeTeams();
    };
  }, [db]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addTeam = async () => {
    const success = await addTeamToDatabase(db, teamName);
    if (success) {
      setTeamName('');
    }
  };

  const addMatch = async () => {
    const success = await addMatchToDatabase(db, formData);
    if (success) {
      setFormData({
        matchTeam1: '',
        matchTeam2: '',
        category: '',
        points: '',
        closeTime: '',
      });
    }
  };

  const closePickem = async (matchId: string) => {
    try {
      const matchesDocRef = doc(db, "matches", "matchData");
      const matchesDocSnap = await getDoc(matchesDocRef);

      if (matchesDocSnap.exists()) {
        const matchesData = matchesDocSnap.data();
        matchesData[matchId].open = false; // Close the pickem
        await setDoc(matchesDocRef, matchesData);
        console.log(`Pickem closed for match ${matchId}`);
      }
    } catch (error) {
      console.error("Error closing pickem:", error);
    }
  };

  const setWinner = async (matchId: string, winner: string) => {
    try {
      const matchesDocRef = doc(db, "matches", "matchData");
      const matchesDocSnap = await getDoc(matchesDocRef);
  
      if (matchesDocSnap.exists()) {
        const matchesData = matchesDocSnap.data();

        // Update match winner in Firestore
        await updateDoc(matchesDocRef, {
          [`${matchId}.winner`]: winner,
          [`${matchId}.open`]: false,
        }); 
  
        // Update all user scores
        const usersCollectionRef = collection(db, "users");
        const userDocsSnap = await getDocs(usersCollectionRef);
  
        userDocsSnap.forEach(async (userDoc) => {
          const userData = userDoc.data();
          // Check if the user made a pick for this match
          const userPick = userData.picks?.[matchId];
          if (userPick === winner) {
            const updatedScore = (userData.score || 0) + parseInt(matchesData[matchId].points, 10);
            // Update the user's score in their document
            await updateDoc(doc(db, "users", userDoc.id), {
              score: updatedScore,
            });
          }
        });

        // Make leaderboard
        const leaderboardQuery = query(usersCollectionRef, orderBy("score", "desc"));
        const leaderboardDocsSnap = await getDocs(leaderboardQuery);
        if (!leaderboardDocsSnap.empty) {
          const matchesData = leaderboardDocsSnap.docs.map((doc) => {
            const data = doc.data();
            return {
              userId: doc.id,
              name: data.name,
              score: data.score,
              rank: data.rank,
            }
          });

          // Algo for ties
          rank_users(matchesData);

          matchesData.forEach(async (user) => {
            const userDocRef = doc(db, "users", user.userId);
            await updateDoc(userDocRef, {
              rank: user.rank,
            });
          });

          // Updating leaderboard
          const leaderboardCollection = matchesData.map((user) => {
            return {
              name: user.name,
              rank: user.rank,
              score: user.score
            }
          })
          const userDocRef = doc(db, "leaderboard", "leaderboardStatus");
          await setDoc(userDocRef, { leaderboard: leaderboardCollection});
        }

      } else {
        console.error("Match data not found.");
      }
    } catch (error) {
      console.error("Error setting winner:", error);
    }
  };

  const columns = [
    {
      name: 'closeTime',
      selector: match => new Date(match.closeTime.seconds * 1000).toLocaleString(),
      sortable: true,
      sortFunction: (a, b) => a.closeTime.seconds - b.closeTime.seconds
    },
    {
      name: 'Category',
      selector: match => match.category,
      sortable: true,
    },
    {
      name: 'open',
      cell:(match) => {
        if (isOpen(match)) {
          return <button onClick={() => closePickem(match.matchId)}>Close</button>
        } else {
          return <button onClick={() => closePickem(match.matchId)} disabled>Close</button>
        }
      },
      sortable: true,
      sortFunction: (a, b) => a.open - b.open
    },
    {
      name: 'team1',
      selector: match => teams.get(match.team1Id),
      cell: (match) => {
        if (match.winner === "-1") {
          return <button onClick={() => setWinner(match.matchId, match.team1Id)}>{teams.get(match.team1Id)}</button>
        } else {
          return teams.get(match.team1Id);
        }
      }
    },
    {
      name: 'team2',
      cell: (match) => {
        if (match.winner === "-1") {
          return <button onClick={() => setWinner(match.matchId, match.team2Id)}>{teams.get(match.team2Id)}</button>
        } else {
          return teams.get(match.team2Id);
        }
      },
    },
    {
      name: 'winner',
      selector: match => teams.get(match.winner),
      sortable: true,
    },
    {
      name: 'points',
      selector: match => match.points,
      sortable: true,
      sortFunction : (a, b) => a.points - b.points
    },
  ];
  
  return (
    <div style={{ width: "95vw", margin: "auto"}}>
      <br />
      <h2>Admin Panel</h2>
      <Tabs
        defaultActiveKey="match"
        id="uncontrolled-tab-example"
        className="mb-3"
      >
        <Tab eventKey="match" title="Matches">
        <h3>Create Match</h3>
        <Form>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="formMatchTeam1">
                <Form.Label>Select Team 1</Form.Label>
                <Form.Select
                  name="matchTeam1"
                  value={formData.matchTeam1}
                  onChange={handleChange}
                >
                  <option value="">Select Team 1</option>
                  {teamOptions.map((team) => (
                    <option key={team.id} value={team.id}>{team.name}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group controlId="formMatchTeam2">
                <Form.Label>Select Team 2</Form.Label>
                <Form.Select
                  name="matchTeam2"
                  value={formData.matchTeam2}
                  onChange={handleChange}
                >
                  <option value="">Select Team 2</option>
                  {teamOptions.map((team) => (
                    <option key={team.id} value={team.id}>{team.name}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="formMatchCategory">
                <Form.Label>Select Match Category</Form.Label>
                <Form.Select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option value="">Select Category</option>
                  {Object.keys(TypesOfMatches).map((matchTypeKey) => (
                    <option key={matchTypeKey} value={TypesOfMatches[matchTypeKey as keyof typeof TypesOfMatches]}>
                      {matchTypeKey}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group controlId="formMatchPoints">
                <Form.Label>Points</Form.Label>
                <Form.Control
                  type="text"
                  name="points"
                  value={formData.points}
                  onChange={handleChange}
                  placeholder="Points"
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="formMatchCloseTime">
                <Form.Label>Pickem Close Time</Form.Label>
                <Form.Control
                  type="datetime-local"
                  name="closeTime"
                  value={formData.closeTime}
                  onChange={handleChange}
                  placeholder="Time to close pickem"
                />
              </Form.Group>
            </Col>
          </Row>

          {/* Submit Button */}
          <Button variant="primary" type="button" onClick={addMatch}>
            Create Match
          </Button>
        </Form>
        
        {/* Matches Table */}
        <DataTable
          title="Matches"
          columns={columns}
          data={matches}
          defaultSortFieldId={1}
        />
        </Tab>
        <Tab eventKey="teams" title="Teams">
          <Form>
            <Form.Group className="mb-3" controlId="formBasicName">
              <h3>Create Team</h3>
              <Form.Label>Team Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                placeholder="SKT1"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
              />
            </Form.Group>
            <Button variant="primary" type="button" onClick={addTeam}>
              Submit
            </Button>
          </Form>

          <h3>Teams</h3>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap', // Cards wrap to next row when no more space in the row
              gap: '20px',
              justifyContent: 'flex-start', // Aligns cards to the left
            }}
          >
            {teamOptions.map((team) => (
              <div
                key={team.id}
                style={{
                  flex: '0 0 286px', // Fixed box width
                  boxSizing: 'border-box',
                }}
              >
                {/* REMEMBER TO ADD IN THE IMAGE PATH IN SECOND */}
                {teamCard(team.name, '')} 
              </div>
            ))}
          </div>
        </Tab>
      </Tabs>
    </div>
  );
};

export default Admin;
