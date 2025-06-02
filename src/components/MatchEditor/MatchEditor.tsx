import { useState, useEffect } from 'react';
import { auth } from "../../firebase/index";
import { Firestore, Timestamp, doc, updateDoc } from "firebase/firestore";  

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';

interface MatchEditorProp {
  db: Firestore;
  teamOptions: Map<string, {
    name: string;
    teamColour: string;
    teamLogo: string;
  }>;
  matchId: string;
  matches: { matchId: string; team1Id: string; team2Id: string; category: string; points: string; closeTime: Timestamp; open: boolean; winner: number, votes: {team1Vote: number, totalVote: number} }[];
}

const MatchEditor = ({ db, teamOptions, matchId, matches }: MatchEditorProp) => {
  // State management for match data and modal visibility
  const [matchData, setMatchData] = useState<{ matchId: string; team1Id: string; team2Id: string; category: string; points: string; closeTime: Timestamp; open: boolean; winner: number, votes: {team1Vote: number, totalVote: number} } | null>(null);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // Set default match data based on the selected matchId
  useEffect(() => {
    const match = matches.find((x) => x.matchId === matchId);
    if (match) {
      setMatchData(match);
    }
  }, [matchId, matches, teamOptions]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === "closeTime" && value) {
      // Parse the value as a datetime string and convert it to a Timestamp
      const timestampValue = Timestamp.fromDate(new Date(value));
      if (matchData) {
        setMatchData(prev => {
          if (prev === null) return null;
          return {
            ...prev,
            [name]: timestampValue
          };
        });
      }
    } else {
      if (matchData) {
        setMatchData(prev => {
          if (prev === null) return null;
          return {
            ...prev,
            [name]: value
          };
        });
      }
    }
  };

  const editMatch = async () => {
    if (!auth.currentUser || !matchData) {
      return;
    }

    const updatedMatchData = {
      [matchData.matchId]: { 
        matchId: matchData.matchId,
        team1Id: matchData.team1Id,
        team2Id: matchData.team2Id,
        category: matchData.category,
        points: matchData.points,
        closeTime: matchData.closeTime,
        open: matchData.open,
        winner: matchData.winner,
        votes: (matchData.votes === undefined ? {team1Vote: 0, totalVote: 0} : matchData.votes)
      }, 
    };
    console.log(updatedMatchData)

    try {
      // Update match data in Firestore
      const matchRef = doc(db, "matches", "matchData");
      await updateDoc(matchRef, updatedMatchData);

      handleClose();
    } catch (error) {
      console.error("Error updating match:", error);
    }
  };

  return (
    <>
      <Button variant="primary" onClick={handleShow} style={{width:"100px"}}>Edit</Button>

      <div style={{ width: "95vw", margin: "auto" }}>
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Match Properties</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            {matchData && (
              <>
                <Form.Label>Select Team 1</Form.Label>
                <Form.Select
                  name="team1Id"
                  value={matchData.team1Id}
                  onChange={handleChange}
                >
                  <option value="">Select Team 1</option>
                  {Array.from(teamOptions.entries()).map(([id, team]) => (
                    <option key={id} value={id}>{team.name}</option>
                  ))}
                </Form.Select>

                <Form.Label>Select Team 2</Form.Label>
                <Form.Select
                  name="team2Id"
                  value={matchData.team2Id}
                  onChange={handleChange}
                >
                  <option value="">Select Team 2</option>
                  {Array.from(teamOptions.entries()).map(([id, team]) => (
                    <option key={id} value={id}>{team.name}</option>
                  ))}
                </Form.Select>

                <Form.Label>Select Category</Form.Label>
                <Form.Control
                  type="text"
                  name="category"
                  value={matchData.category}
                  onChange={handleChange}
                />

                <Form.Label>Points</Form.Label>
                <Form.Control
                  type="text"
                  name="points"
                  value={matchData.points}
                  onChange={handleChange}
                />

                <Form.Label>Close Time</Form.Label>
                <Form.Control
                  type="datetime-local"
                  name="closeTime"
                  value={matchData.closeTime
                    ? new Date(matchData.closeTime.toDate()).toLocaleString('en-US', { 
                        timeZone: 'Australia/Sydney', 
                        hour12: false, 
                        year: 'numeric', 
                        month: '2-digit', 
                        day: '2-digit', 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })
                    : ""} 
                  onChange={handleChange}
                />
              </>
            )}
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="primary" onClick={editMatch}>
              Update Match
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
};

export default MatchEditor;
