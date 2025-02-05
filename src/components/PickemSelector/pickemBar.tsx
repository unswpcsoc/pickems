import React from 'react';
import Button from 'react-bootstrap/Button';
import classNames from 'classnames';
import { pickemResult } from "../../components";
import imagea from "../../assets/faker.png"; // Correct image path

interface PickemBarProps {
  match: { matchId: number; team1Id: string; team2Id: string; category: string; points: string; closeTime: any, open: boolean, winner: string };
  userPick: string;
  teams: { [key: string]: { name: string, colour: string, teamLogo: string } };
  handlePick: (matchId: number, teamId: string) => void;
}

function isOpen(match: { matchId: number; team1Id: string; team2Id: string; category: string; points: string; closeTime: any, open: boolean, winner: string }) {
  return match.open && match.closeTime.seconds > Date.now() / 1000;
}

const PickemBar: React.FC<PickemBarProps> = ({ match, userPick, teams, handlePick }) => {
  return (
    <>
    <div className="match-header" style={{ marginLeft:"30px" }}>
      <h4>{`${match.closeTime.toDate().toLocaleTimeString()} ${match.closeTime.toDate().toDateString()}`}</h4>
    </div>

    <div key={match.matchId} className="match-container" style={{ backgroundColor:"#212529" }}>
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
            variant={userPick === match.team1Id ? 'secondary' : 'outline-secondary'}
            disabled={!isOpen(match)}
            style={{
              flex: 1,
              minHeight: '120px',
              // backgroundColor: userPick === match.team1Id ? teams[match.team1Id]?.colour : '',
              backgroundImage: userPick === match.team1Id ? `linear-gradient(to left, ${teams[match.team1Id]?.colour}, #30353b)` : "",
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
                <div className="team-name" style={{ color:"white" }}>
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
        >
          <Button
            variant={userPick === match.team2Id ? 'secondary' : 'outline-secondary'}
            disabled={!isOpen(match)}
            style={{
              flex: 1,
              minHeight: '120px',
              // backgroundColor: userPick === match.team2Id ? teams[match.team2Id]?.colour : '',
              backgroundImage: userPick === match.team2Id ? `linear-gradient(to right, ${teams[match.team2Id]?.colour}, #30353b)` : "",
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
                <div className="team-name" style={{ color:"white" }}>
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
