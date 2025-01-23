import React from 'react';
import { Timestamp } from "firebase/firestore";  //REMOVE IF MAKING database.tsx

import Button from 'react-bootstrap/Button';
import classNames from 'classnames';
import pickemResult from "./pickemResult";
import imagea from "../assets/faker.png"; // Correct image path

interface PickemBarProps {
  match: { matchId: string, team1Id: string, team2Id: string, category: string, points: string, closeTime: Timestamp, open: boolean, winner: string };
  userPick: string;
  teams: Map<string, string>;
  handlePick: (matchId: string, teamId: string) => void;
}

const PickemBar: React.FC<PickemBarProps> = ({ match, userPick, teams, handlePick }) => {
  return (
    <div key={match.matchId} className="match-container">
      <div className="teams">
        {/* Team 1 Section */}
        <div
          className={classNames('team', {
            chosen: userPick === match.team1Id,
            unchosen: userPick === match.team2Id,
          })}
          onClick={() => handlePick(match.matchId, match.team1Id)}
        >
          <Button
            variant={userPick === match.team1Id ? 'success' : 'outline-success'}
            style={{ flex: 1, minHeight: '120px' }}
          >
            <div className="team-content">
              {/* Points on the left */}
              <div className="points">
                {match.team1Id === userPick ? (pickemResult(match, userPick)) : ("")}
              </div>
              {/* Content container for logo and team name centered */}
              <div className="team-center">
                <div className="team-image">
                  <img src={imagea} alt="Team logo" style={{ maxWidth: '50px' }} />
                </div>
                <div className="team-name">
                  {teams.get(match.team1Id)}
                </div>
              </div>
            </div>
          </Button>
        </div>

        {/* Team 2 Section */}
        <div
          className={classNames('team', {
            chosen: userPick === match.team2Id,
            unchosen: userPick === match.team1Id,
          })}
          onClick={() => handlePick(match.matchId, match.team2Id)}
        >
          <Button
            variant={userPick === match.team2Id ? 'success' : 'outline-success'}
            style={{ flex: 1, minHeight: '120px' }}
          >
            <div className="team-content">
              {/* Points on the left */}
              <div className="points">
                {match.team2Id === userPick ? (pickemResult(match, userPick)) : ("")}
              </div>
              {/* Content container for logo and team name centered */}
              <div className="team-center">
                <div className="team-image">
                  <img src={imagea} alt="Team logo" style={{ maxWidth: '50px' }} />
                </div>
                <div className="team-name">
                  {teams.get(match.team2Id)}
                </div>
              </div>
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PickemBar;
