import React from 'react';
import Button from 'react-bootstrap/Button';
import classNames from 'classnames';
import { Match } from './Pickem';
import { pickemResult } from "../../components";
import imagea from "../../assets/faker.png"; // Correct image path

interface PickemBarProps {
  match: Match;
  userPick: string;
  teams: { [key: string]: { name: string, colour: string, teamLogo: string } };
  handlePick: (matchId: number, teamId: string) => void;
}

const PickemBar: React.FC<PickemBarProps> = ({ match, userPick, teams, handlePick }) => {
  return (
    <>
    <div className="match-header" style={{ marginLeft:"30px" }}>
      <h4>{`${match.closeTime.toDate().toLocaleTimeString()} ${match.closeTime.toDate().toDateString()}`}</h4>
    </div>

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
            style={{
              flex: 1,
              minHeight: '120px',
              backgroundColor: userPick === match.team1Id ? teams[match.team1Id]?.colour : '',
              color: userPick === match.team1Id ? '#fff' : '',
            }}
          >
            <div className="team-content">
              <div className="points">
                {match.team1Id === userPick ? (pickemResult(match, userPick)) : ("")}
              </div>

              <div className="team-center">
                <div className="team-image">
                  <img src={teams[match.team1Id]?.teamLogo || imagea} alt="Team logo" style={{ maxWidth: '50px' }} />
                </div>
                <div className="team-name">
                  {teams[match.team1Id]?.name}
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
          style={{
            backgroundColor: userPick === match.team2Id ? teams[match.team2Id]?.colour : '',
          }}
        >
          <Button
            variant={userPick === match.team2Id ? 'success' : 'outline-success'}
            style={{
              flex: 1,
              minHeight: '120px',
              backgroundColor: userPick === match.team2Id ? teams[match.team2Id]?.colour : '',
              color: userPick === match.team1Id ? '#fff' : '', 
            }}
          >
            <div className="team-content">
              <div className="points">
                {match.team2Id === userPick ? (pickemResult(match, userPick)) : ("")}
              </div>

              <div className="team-center">
                <div className="team-image">
                  <img src={teams[match.team2Id]?.teamLogo ||  imagea} alt="Team logo" style={{ maxWidth: '50px' }} />
                </div>
                <div className="team-name">
                  {teams[match.team2Id]?.name}
                </div>
              </div>
            </div>
          </Button>
        </div>
      </div>
    </div>
    </>
  );
};

export default PickemBar;
