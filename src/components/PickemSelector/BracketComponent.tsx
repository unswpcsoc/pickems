import React from 'react';
import "./BracketComponent.css";
import { Button } from 'react-bootstrap';
// Credits to Julia 👩🏻‍💻 GDE on dev.to for creating an accessible tournament bracket. I am basing my brackets off her work/design using lists and adjusting it for pickems use. https://dev.to/yuridevat/can-tournament-brackets-be-accessible-34og
// Other reference https://river.me/blog/tournament-brackets/#grid-layout-css


interface PickemBarProps {
  match: { matchId: number; team1Id: string; team2Id: string; category: string; points: string; closeTime: any, open: boolean, winner: string, votes: {team1Vote: number, totalVote: number} };
  userPick: string;
  teams: { [key: string]: { name: string, colour: string, teamLogo: string } };
  handlePick: (matchId: number, teamId: string) => void;
}

function isOpen(match: { matchId: number; team1Id: string; team2Id: string; category: string; points: string; closeTime: any, open: boolean, winner: string, votes: {team1Vote: number, totalVote: number} }) {
  return match.open && match.closeTime.seconds > Date.now() / 1000;
}

const BracketComponent = () => {
  // Const for when pickems are not done by user

  // console.log(match.team1Id, match.team2Id , match.winner,"||", userPick)
  return (
    <>

    <div className="bracket br-2"   >
        <section  aria-labelledby="round-1">
            <h2 id="round-1">Round 1</h2>
                <div className="bracketBorder">
                <a href="#"><Button>Click to pick</Button></a>
                <span>Date: 01.01. 1pm</span>
                </div>
                <div className="bracketBorder">
                <a href="#"><Button>Click to pick</Button></a>
                <span>Date: 01.01. 1.30pm</span>
                </div>
                <div className="bracketBorder">
                <a href="#"><Button>Click to pick</Button></a>
                <span>Date: 01.01. 2pm</span>
                </div>
                <div className="bracketBorder">
                <a href="#"><Button>Click to pick</Button></a>
                <span>Date: 01.01. 2pm</span>
                </div>
        </section>
        <section aria-labelledby="round-2">
            <h2 id="round-2">Round 2</h2>
            <ol style={{marginTop: "45px"}}>
                <li>
                <div className="bracketBorder">
                    <a href="#"><Button>Click to pick</Button></a>
                    <span>Date: 05.01. 1pm</span>
                </div>
                </li>
                <li>
                <div className="bracketBorder">
                    <a href="#"><Button>Click to pick</Button></a>
                    <span>Date: 05.01. 1.30pm</span>
                </div>
                </li>
            </ol>
        </section>
        <section aria-labelledby="round-3">
            <h2 id="round-3">Round 3</h2>
            <ol style={{marginTop: "60px"}}>
            <li>
                <div className="bracketBorder">
                <a href="#"><Button>Click to pick</Button></a>
                <span>Date: 07.01. 1pm</span>
                </div>
            </li>
            </ol>
        </section> 
    </div>

    {/* <div className="bracket br-2"   >
        <section  aria-labelledby="round-1">
            <h2 id="round-1">Round 1</h2>
            <ol>
            <li>
                <div className="bracketBorder">
                <a href="#"><Button>Click to pick</Button></a>
                <span>Date: 01.01. 1pm</span>
                </div>
            </li>
            <li>
                <div className="bracketBorder">
                <a href="#"><Button>Click to pick</Button></a>
                <span>Date: 01.01. 1.30pm</span>
                </div>
            </li>
            <li style={{borderTop: "45px"}}>
                <div className="bracketBorder">
                <a href="#"><Button>Click to pick</Button></a>
                <span>Date: 01.01. 2pm</span>
                </div>
            </li>
            <li style={{borderTop: "45px"}}>
                <div className="bracketBorder">
                <a href="#"><Button>Click to pick</Button></a>
                <span>Date: 01.01. 2pm</span>
                </div>
            </li>
            </ol>
        </section>
        <section aria-labelledby="round-2">
            <h2 id="round-2">Round 2</h2>
            <ol style={{marginTop: "45px"}}>
                <li>
                <div className="bracketBorder">
                    <a href="#"><Button>Click to pick</Button></a>
                    <span>Date: 05.01. 1pm</span>
                </div>
                </li>
                <li>
                <div className="bracketBorder">
                    <a href="#"><Button>Click to pick</Button></a>
                    <span>Date: 05.01. 1.30pm</span>
                </div>
                </li>
            </ol>
        </section>
        <section aria-labelledby="round-3">
            <h2 id="round-3">Round 3</h2>
            <ol style={{marginTop: "60px"}}>
            <li>
                <div className="bracketBorder">
                <a href="#"><Button>Click to pick</Button></a>
                <span>Date: 07.01. 1pm</span>
                </div>
            </li>
            </ol>
        </section> 
    </div>*/}
    </>
  );
};

export default BracketComponent;
