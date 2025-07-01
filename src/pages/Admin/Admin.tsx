// src/components/AdminPanel.tsx
import { useState, useEffect } from 'react';
import { db } from "../../firebase/index";
import { collection, query, getDocs, Timestamp, doc, onSnapshot } from "firebase/firestore";  //REMOVE IF MAKING database.tsx

import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { teamCard, TeamBuilder, MatchBuilder } from "../../components"
import { createTheme } from 'react-data-table-component';
import { Button } from 'react-bootstrap';

import { addVoteDataToMatch } from "../../firebase/database"
import { CategoryCreator, CategoryDisplay } from "../../components/index";
import { MatchDisplay } from "../../components/index";
import { InpersonLeaderboard, RemoteLeaderboard } from "../../components/index";
import { updateLeaderboard } from "../../firebase/leaderboard";

createTheme('dark', {
  background: {
    default: 'transparent',
  },
});


const Admin = () => {
  // States for team and match display
  const [teams, setTeams] = useState<Map<string, {name: string, teamColour: string, teamLogo: string}>>(new Map());
  const [matches, setMatches] = useState<{ matchId: string, team1Id: string, team2Id: string, category: string, points: string, closeTime: Timestamp, open: boolean, winner: number, votes: {team1Vote: number, totalVote: number} }[]>([]); // Matches state

    // States for categories and category pickems
  const [categories, setCategories] = useState<Map<string, { name: string, items: Map<string,string> }>>(new Map());
  // const [crystalPickems, setMatches] = useState<{ matchId: string, team1Id: string, team2Id: string, category: string, points: string, closeTime: Timestamp, open: boolean, winner: number, votes: {team1Vote: number, totalVote: number} }[]>([]); // Matches state
  // First get categories, from each category get their respecitve pickems (multiple files 0 -> n).
  // all these pickems should be in crystalPickems.

  // Leaderboard states for admin
  const [inPersonLeaderboard, setInPersonleaderboard] = useState<any[]>([]);  // State to hold the leaderboard data
  const [remoteLeaderboard, setRemoteLeaderboard] = useState<any[]>([]);  // State to hold the leaderboard data

  // Using snapshot to update both teams and matches on server update
  useEffect(() => {
    const fetchTeams = onSnapshot(doc(db, "teams", "teamData"), (docSnapshot) => {
      if (docSnapshot.exists()) {
        const teamsData = docSnapshot.data();
        console.log(teamsData);
        const teams =  new Map<string, {name: string, teamColour: string, teamLogo: string}>();
        Object.keys(teamsData).forEach((id) => {
          teams.set(id, {
            name: teamsData[id].name, 
            teamColour: teamsData[id].teamColour, 
            teamLogo: teamsData[id].teamLogo,
          })
        })

        setTeams(teams);
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
          votes: (matchesData[id].votes === undefined ? {team1Vote: 0, totalVote: 0} : matchesData[id].votes)
        }));

        matchList = matchList.sort((a, b) => a.closeTime.seconds - b.closeTime.seconds);
        setMatches(matchList);
      }
    }, (error) => {
      console.error("Error listening to matches: ", error);
    });

    const fetchCategories = onSnapshot(doc(db, "crystalBall", "categories"), (docSnapshot) => {
      if (docSnapshot.exists()) {
        const categoryData = docSnapshot.data();
        console.log(categoryData);
        const categories =  new Map<string, { name: string, items: Map<string,string> }>();
        Object.keys(categoryData).forEach((id) => {
          categories.set(id, {
            name: categoryData[id].name, 
            items: categoryData[id].items
          })
        })

        setCategories(categories);
      }
    }, (error) => {
      console.error("Error fetching categories: ", error);
    });

    const inPersonUnsubscribe = onSnapshot(doc(db, "leaderboard", "inPersonLeaderboard"), (docSnapshot) => {
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        if (data && data.leaderboard) {
          // Sort the leaderboard by rank
          const sortedLeaderboard = data.leaderboard.sort((a: any, b: any) => a.rank - b.rank);
          setInPersonleaderboard(sortedLeaderboard);
        }
      }
    }, (error) => {
      console.error("Error fetching leaderboard:", error);
    });

    const remoteUnsubscribe = onSnapshot(doc(db, "leaderboard", "remoteLeaderboard"), (docSnapshot) => {
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        if (data && data.leaderboard) {
          // Sort the leaderboard by rank
          const sortedLeaderboard = data.leaderboard.sort((a: any, b: any) => a.rank - b.rank);
          setRemoteLeaderboard(sortedLeaderboard);
        }
      }
    }, (error) => {
      console.error("Error fetching leaderboard:", error);
    });

    // Clean up the listener when the component unmounts
    return () => {
      fetchTeams();
      fetchMatches();
      fetchCategories();
      inPersonUnsubscribe();
      remoteUnsubscribe();
    };
  }, [db]);

  const updateVoteStats = async () => {
    const usersCollectionQuery = query(collection(db, "users"));
    const usersCollectionDocsSnap = await getDocs(usersCollectionQuery);
    if (!usersCollectionDocsSnap.empty) {
      const users = usersCollectionDocsSnap.docs.map((userData) => {
        const data = userData.data();
        return {
          picks: data.picks,
        }
      })

      for (const match of matches) {
        match.votes.team1Vote = 0;
        match.votes.totalVote = 0;
      }

      for (const user of users) {
        if (user.picks !== undefined) {
          for (const userPick of Object.entries(user.picks)) {
            for (const match of matches) {
              if (match.matchId === userPick[0] && match.team1Id === userPick[1]) {
                match.votes.team1Vote++;
                match.votes.totalVote++;
              } else if (match.matchId === userPick[0]) {
                match.votes.totalVote++;
              }
            }
          }
        }
      }
      addVoteDataToMatch(db, matches);
    }
  }

  return (
    <div style={{ width: "95vw", margin: "auto"}}>
      <br />
      <h2>Admin Panel</h2>
      <Tabs
        defaultActiveKey="match"
        id="uncontrolled-tab-example"
        className="mb-3"
      >
        <Tab eventKey="crystalBall" title="Crystal Ball">
          <p>Tutorial: First make a category (e.g. champions, dragons, objectives), then using these categories you can make crystal ball pickems. Note if they are discrete crystal balls (e.g. most kills, most deaths) without it pertaining to a particular category/subject, then the crystal ball can be made without a category.</p>
          <Tabs
            defaultActiveKey="match"
            id="uncontrolled-tab-example"
            className="mb-3"
          >
            <Tab eventKey="createCrystalBalls" title="Create Crystal Balls">
              {/* add create ball creator here */}
            </Tab>
            <Tab eventKey="category" title="Categories">
              <CategoryCreator db={db} />
              <h3>Categories</h3>
              <CategoryDisplay categories={categories} />
            </Tab>
          </Tabs>
        </Tab>
        <Tab eventKey="brackets" title="Brackets">
          <Tabs
            defaultActiveKey="match"
            id="uncontrolled-tab-example"
            className="mb-3"
          >
            <Tab eventKey="match" title="Matches">
              <MatchBuilder db={db} teamOptions={teams}/>

              <MatchDisplay teams={teams} matches={matches} />
            </Tab>

            <Tab eventKey="teams" title="Teams">
              <TeamBuilder db={db} />

              <h3>Teams</h3>
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap', // Cards wrap to next row when no more space in the row
                  gap: '20px',
                  justifyContent: 'flex-start', // Aligns cards to the left
                }}
              >
                {Array.from(teams.entries()).map(([id, team]) => (
                  <div
                    style={{
                      flex: '0 0 286px', // Fixed box width
                      boxSizing: 'border-box',
                    }}
                  >
                    {/* REMEMBER TO ADD IN THE IMAGE PATH IN SECOND */}
                    {teamCard(id, team)} 
                  </div>
                ))}
              </div>
            </Tab>
          </Tabs>
        </Tab>

        <Tab eventKey="miscellaneous" title="Miscellaneous Commands">
          <h3>Update Vote Stats</h3>
          <p>This is a manual command, and will update the data on the percentage of votes of each pickems.</p>
          <Button onClick={updateVoteStats}>Update Stats</Button>

          <h3>Update Leaderboard</h3>
          <p>Leaderboard is updated automatically when a match is closed. However, you can manually update the leaderboard with the button below (Note this could affect the firestore bill by a lot based on the number of users).</p>
          <Button onClick={updateLeaderboard}>Update Leaderboard</Button>
        </Tab>
        <Tab eventKey="leaderboards" title="Prize Leaderboards">
          <Tabs>
            <Tab eventKey="inPerson-leaderboard" title="InPerson Leaderboard">
              <InpersonLeaderboard leaderboard={inPersonLeaderboard} />
            </Tab>
            <Tab eventKey="remote-leaderboard" title="Remote Leaderboard">
              <RemoteLeaderboard leaderboard={remoteLeaderboard} />
            </Tab>
          </Tabs>
        </Tab>
      </Tabs>
    </div>
  );
};

export default Admin;
