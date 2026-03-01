import React, { useState } from "react";
import "./BracketComponent.css";
import { BracketMatchData } from "../../defines";
import { User } from 'firebase/auth';
import { auth, db } from "../../firebase/index";
import { doc, updateDoc, onSnapshot } from 'firebase/firestore';
import correct from "../../assets/Correct.png";
import incorrect from "../../assets/Incorrect.png";

// TO do, remove reset button + 2 other buttons
// Have a submit button at the bottom instead

// Create new dat astruct to store this as one map? (Semi match 1, Semi match 2, finals, loser final)
// Create pickems called bracket that we can just read for this with following data strucutre
/*
  matchId: {
    teamId1:
    teamId2:
    winner:
    points:
    type: 1,2,3,4 (just use number for now to correspond to 1/2 semi, 3/4 semi, finals, loser finals)
  }
*/

interface BracketComponentProp {  
  teams: { [key: string]: { name: string, colour: string, teamLogo: string } };
  matches: BracketMatchData[];
  picks: { [key: number]: string };
}

const BracketComponent = ({teams, matches, picks}: BracketComponentProp) => {
  
  if (!matches || matches.length < 2 || Object.keys(teams).length === 0) {
    return <div>Loading bracket...</div>;
  }

  const initialTeams = {
    semi1: [matches[0].team1Id, matches[0].team2Id],
    semi2: [matches[1].team1Id, matches[1].team2Id],
  };

  const [semiWinners, setSemiWinners] = useState({
    semi1: picks[0] !== undefined ? picks[0] : null,
    semi2: picks[1] !== undefined ? picks[1] : null,
  });

  const [semiLosers, setSemiLosers] = useState({
    semi1: picks[0] !== undefined ? (matches[0].team1Id === picks[0] ? matches[0].team2Id : matches[0].team1Id) : null,
    semi2: picks[1] !== undefined ? (matches[1].team1Id === picks[1] ? matches[1].team2Id : matches[1].team1Id) : null,
  });

  const [finalWinner, setFinalWinner] = useState(picks[2] !== undefined ? picks[2] : null);
  const [thirdPlaceWinner, setThirdPlaceWinner] = useState(picks[3] !== undefined ? picks[3] : null);
  const [message, setMessage] = useState("");

  const handleSemiPick = (semi, winner) => {
    const loser =
      initialTeams[semi][0] === winner
        ? initialTeams[semi][1]
        : initialTeams[semi][0];

    setSemiWinners({ ...semiWinners, [semi]: winner });
    setSemiLosers({ ...semiLosers, [semi]: loser });

    setFinalWinner(null);
    setThirdPlaceWinner(null);
  };

  const resetBracket = () => {
    setSemiWinners({ semi1: null, semi2: null });
    setSemiLosers({ semi1: null, semi2: null });
    setFinalWinner(null);
    setThirdPlaceWinner(null);
  };

  const submitPickem = async () => {
    if (semiLosers.semi1 === null || semiLosers.semi2 === null || semiWinners.semi1 === null || semiWinners.semi2 === null || finalWinner === null || thirdPlaceWinner === null) {
      // Make text message to select all
      setMessage("Please pick a winner for all four matches!");
    } else {
      // Submit to DB (make sure to deactivate buttons before game start)
      const updatedPicks: { [key: number]: string } = {
        0: semiWinners.semi1,      // Semi 1
        1: semiWinners.semi2,      // Semi 2
        2: finalWinner,            // Final
        3: thirdPlaceWinner,       // 3rd place
      };

      const userDocRef = doc(db, 'users', (auth.currentUser as User).uid);
      try {
        await updateDoc(userDocRef, {
          bracketPickems: updatedPicks,
        });
        setMessage("Pickem submitted!")
      } catch (error) {
        setMessage("An error has occured, please try submitting again")
        setMessage(error.message)
      }
    }
  }

  return (
    <div className="bracket-container">
      <p style={{fontSize: "20px", textAlign: "center", marginBottom: "0px"}}>{message}</p>
      <div className="bracket">

        {/* Semi Finals */}
        <div className="round">
          <div className="type-container">
            <p style={{fontSize: "20px", marginBottom: "0px"}}>Semi Finals</p>
            <p style={{marginBottom: "0px"}}>30 points/pick</p>
          </div>
          
          {["semi1", "semi2"].map((semi) => (
            <div key={semi} className="match">
              {initialTeams[semi].map((id) => {
                const team = teams[id];
                if (!team) return null;
                return (
                  <>
                  <button
                    key={team.name}
                    className={semiWinners[semi] === id ? "teamBrackets selected" : "teamBrackets"}
                    onClick={() => handleSemiPick(semi, id)}
                  >
                    <img src={team.teamLogo} alt="Team logo" className={"teamBrackets-image"} />
                    {team.name}
                    {semi === "semi1" ? (
                      <>
                      {matches[0].winner === picks[0] && id === picks[0] ? (
                        <div className="result-icon"><img src={correct}></img></div>
                      ) : (
                        (id === picks[0] && matches[0].winner !== "" && <div className="result-icon"><img src={incorrect}></img></div>)
                      )}
                      </>
                    ) : (
                      <>
                      {matches[1].winner === picks[1] && id === picks[1] ? (
                        <img src={correct}></img>
                      ) : (
                        (id === picks[1] && matches[1].winner !== "" && <div className="result-icon"><img src={incorrect}></img></div>)
                      )}
                      </>
                    )}
                  </button>
                  </>
                )
              })}
            </div>
          ))}
        </div>

        {/* Finals */}
        <div className="round">
          <div className="type-container">
            <p style={{fontSize: "20px", marginBottom: "0px"}}>Finals / Loser Finals</p>
            <p style={{marginBottom: "0px"}}>60 points/pick</p>
          </div>

          <div className="round-finals">
            <div className="match">
              {semiWinners.semi1 && semiWinners.semi2 ? (
                [semiWinners.semi1, semiWinners.semi2].map((id) => {
                const team = teams[id];
                if (!team) return null;
                return (
                  <button
                    key={team.name}
                    className={
                      finalWinner === id ? "teamBrackets selected" : "teamBrackets"
                    }
                    onClick={() => setFinalWinner(id)}
                  >
                    <img src={team.teamLogo} alt="Team logo" className={"teamBrackets-image"} />
                    {team.name}
                    {matches[2].winner !== "" && matches[2].winner === picks[2] && id === picks[2] ? (
                      <div className="result-icon"><img src={correct}></img></div>
                    ) : (
                      (id === picks[2] && matches[2].winner !== "" && <div className="result-icon"><img src={incorrect}></img></div>)
                    )}
                  </button>
                )})
              ) : (
                <div className="placeholder">Waiting for Semi Winners</div>
              )}
            </div>

            {/* <h2>3rd Place Match</h2> */}
            <div className="match" >
              <p>Losers Final</p>
              {semiLosers.semi1 && semiLosers.semi2 ? (
                [semiLosers.semi1, semiLosers.semi2].map((id) => {
                const team = teams[id];
                if (!team) return null;
                return (
                  <button
                    key={team.name}
                    className={
                      thirdPlaceWinner === id ? "teamBrackets selected" : "teamBrackets"
                    }
                    onClick={() => setThirdPlaceWinner(id)}
                  >
                    <img src={team.teamLogo} alt="Team logo" className={"teamBrackets-image"} />
                    {team.name}
                    {matches[3].winner !== "" && matches[3].winner === picks[3] && id === picks[3] ? (
                      <div className="result-icon"><img src={correct}></img></div>
                    ) : (
                      (id === picks[3] && matches[3].winner !== "" && <div className="result-icon"><img src={incorrect}></img></div>)
                    )}
                  </button>
                )})
              ) : (
                <div className="placeholder">Waiting for Semi Losers</div>
              )}
            </div>
          </div>
          
        </div>
      </div>
      
      <div className="submission-button-container">
        <button className="submission-button" onClick={submitPickem}>
          Submit Pickems
        </button>
      </div>
    </div>
  );
}

export default BracketComponent;