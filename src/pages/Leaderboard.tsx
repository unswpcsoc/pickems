import { useState, useEffect } from 'react';
import { getOrdinalSuffix } from "../utils";

import { Firestore, doc, onSnapshot } from 'firebase/firestore';
import './User.css';

import DataTable from 'react-data-table-component';

type UserPanelProps = {
  db: Firestore;
};

const Leaderboard = ({ db }: UserPanelProps) => {
  const [leaderboard, setLeaderboard] = useState<any[]>([]);  // State to hold the leaderboard data

  useEffect(() => {
    // Listen for changes to the leaderboard status document in Firestore
    const leaderboardDocRef = doc(db, "leaderboard", "leaderboardStatus");

    const unsubscribe = onSnapshot(leaderboardDocRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        if (data && data.leaderboard) {
          // Sort the leaderboard by rank
          const sortedLeaderboard = data.leaderboard.sort((a: any, b: any) => a.rank - b.rank);
          setLeaderboard(sortedLeaderboard);
        }
      }
    }, (error) => {
      console.error("Error fetching leaderboard:", error);
    });
    console.log(leaderboard);
    // Clean up the listener when the component is unmounted
    return () => unsubscribe();
  }, [db]);

  const columns = [
    {
      name: "Rank",
      selector: user => getOrdinalSuffix(user.rank),
      sortable: true,
      sortFunction: (a: any, b: any) => a.rank - b.rank,
    },
    {
      name: "Name",
      selector: user => user.name,
      sortable: true,
    },
    {
      name: "Score",
      selector: user => user.score,
      sortable: true,
      sortFunction: (a: any, b: any) => a.score - b.score,
    },
  ]

  return (
    <div style={{ width: "95vw", margin: "auto"}}>
      <br />
      <h1>Leaderboard</h1>
      <DataTable
        title="Matches"
        columns={columns}
        data={leaderboard}
        // defaultSortFieldId={1}
      />
      {/* <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Name</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map((user, index) => (
            <tr key={index}>
              <td>{getOrdinalSuffix(user.rank)}</td>
              <td>{user.name}</td>
              <td>{user.score}</td>
            </tr>
          ))}
        </tbody>
      </table> */}
    </div>
  );
};

export default Leaderboard;