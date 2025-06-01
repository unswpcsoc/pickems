import { useState, useEffect } from 'react';
import { getOrdinalSuffix } from "../../utils";
import { db } from "../../firebase/index";
import { doc, onSnapshot } from 'firebase/firestore';
import './User.css';

import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import DataTable from 'react-data-table-component';
import { createTheme } from 'react-data-table-component';
createTheme('dark', {
  background: {
    default: 'transparent',
  },
});

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState<any[]>([]);  // State to hold the leaderboard data
  const [inPersonleaderboard, setInPersonleaderboard] = useState<any[]>([]);  // State to hold the leaderboard data
  const [remoteLeaderboard, setRemoteLeaderboard] = useState<any[]>([]);  // State to hold the leaderboard data

  useEffect(() => {
    // Listen for changes to the leaderboard status document in Firestore
    const leaderboardDocRef = doc(db, "leaderboard", "leaderboardStatus");
    const inPersonLeaderboardDocRef = doc(db, "leaderboard", "inPersonLeaderboard");
    const remoteLeaderboardDocRef = doc(db, "leaderboard", "remoteLeaderboard");

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

    const inPersonUnsubscribe = onSnapshot(inPersonLeaderboardDocRef, (docSnapshot) => {
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

    const remoteUnsubscribe = onSnapshot(remoteLeaderboardDocRef, (docSnapshot) => {
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

    // Clean up the listener when the component is unmounted
    return () => {
      unsubscribe();
      inPersonUnsubscribe();
      remoteUnsubscribe();
    }
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
      selector: user => (user.name + (user.inPerson ? "" : "*")),
      sortable: true,
    },
    {
      name: "Score",
      selector: user => user.score,
      sortable: true,
      sortFunction: (a: any, b: any) => a.score - b.score,
    },
  ]

  const specificLeaderboardCol = [
    {
      name: "Rank",
      selector: user => getOrdinalSuffix(user.rank),
      sortable: true,
      sortFunction: (a: any, b: any) => a.rank - b.rank,
    },
    {
      name: "Name",
      selector: user => (user.name),
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
      <p>Click which leaderboard you would like to see!</p>
      <p>Total leaderboard is a combination of both in person and remote players. Look at the other two for specific rankings for prizing.</p>
      <Tabs
        defaultActiveKey="match"
        id="uncontrolled-tab-example"
        className="mb-3"
      >
        <Tab eventKey="total-leaderboard" title="Total Leaderboard">
          <p>Note: All names with (*) at the end of their names are remote users and are only eligible for the remote prize pool.</p>
          <DataTable
            title="Matches"
            columns={columns}
            data={leaderboard}
            defaultSortFieldId={1}
            theme='dark'
          />
        </Tab>
        <Tab eventKey="inperson-leaderboard" title="In Person Leaderboard">
        <DataTable
            title="Matches"
            columns={specificLeaderboardCol}
            data={inPersonleaderboard}
            defaultSortFieldId={1}
            theme='dark'
          />
        </Tab>
        <Tab eventKey="remote-leaderboard" title="Remote Leaderboard">
        <DataTable
            title="Matches"
            columns={specificLeaderboardCol}
            data={remoteLeaderboard}
            defaultSortFieldId={1}
            theme='dark'
          />
        </Tab>
      </Tabs>
    </div>
  );
};

export default Leaderboard;