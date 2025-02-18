import React from 'react';
import Button from 'react-bootstrap/Button';
import classNames from 'classnames';
import { pickemResult } from "..";
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

const PickemComponent: React.FC<PickemBarProps> = ({ match, userPick, teams, handlePick }) => {
  // Const for when pickems are not done by user
  const noPick: boolean = (userPick === "");
  const noUserPickTeam1 :boolean = (noPick && match.winner === match.team1Id);
  const noUserPickTeam2 :boolean = (noPick && match.winner === match.team2Id);

  // console.log(match.team1Id, match.team2Id , match.winner,"||", userPick)
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
            chosen: userPick === match.team1Id || noUserPickTeam1,
            unchosen: userPick === match.team2Id || noUserPickTeam2,
          })}
          onClick={() => handlePick(match.matchId, match.team1Id)}
        >
          <Button
            variant={userPick === match.team1Id  ? 'secondary' : 'outline-secondary'}
            disabled={!isOpen(match)}
            style={{
              flex: 1,
              minHeight: '120px',
              // backgroundColor: userPick === match.team1Id ? teams[match.team1Id]?.colour : '',
              backgroundImage: userPick === match.team1Id || noUserPickTeam1  ? `linear-gradient(to left, ${teams[match.team1Id]?.colour}, #30353b)` : "",
              color: userPick === match.team1Id ? '#fff' : '',
            }}
          >
            <div className="team-content">
              {/* Points earned from pickem */}
              {match.team1Id === userPick || noUserPickTeam1 ?  (pickemResult(match, userPick)) : ""}

              <div className="team-center">
                <div className="team-image">
                  <img src={teams[match.team1Id]?.teamLogo || imagea} alt="Team logo" style={{ maxWidth: '50px' }} />
                </div>
                <div className="team-name" style={{ color:"white" }}>
                  {(userPick === match.team1Id || noPick) ? teams[match.team1Id]?.name : ""}
                </div>
              </div>
            </div>
          </Button>
        </div>

        {/* Team 2 Section */}
        <div
          className={classNames('team', {
            chosen: userPick === match.team2Id || noUserPickTeam2,
            unchosen: userPick === match.team1Id || noUserPickTeam1,
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
              backgroundImage: userPick === match.team2Id || noUserPickTeam2 ? `linear-gradient(to right, ${teams[match.team2Id]?.colour}, #30353b)` : "",
              color: userPick === match.team1Id ? '#fff' : '',
            }}
          >
            <div className="team-content">
              {/* Points earned from pickem */}
              {match.team2Id === userPick || noUserPickTeam2 ?  (pickemResult(match, userPick)) : ""}

              <div className="team-center">
                <div className="team-image">
                  <img src={teams[match.team2Id]?.teamLogo ||  imagea} alt="Team logo" style={{ maxWidth: '50px' }} />
                </div>
                <div className="team-name" style={{ color:"white" }}>
                  {(userPick === match.team2Id || noPick) ? teams[match.team2Id]?.name : ""}
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

export default PickemComponent;
