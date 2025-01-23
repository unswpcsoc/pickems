import { Timestamp } from "firebase/firestore";  //REMOVE IF MAKING database.tsx
import Badge from 'react-bootstrap/Badge';
import Image from 'react-bootstrap/Image';
import correctImage from "../assets/Correct.png";
import incorrectImage from "../assets/Incorrect.png";

interface Match { matchId: string, team1Id: string, team2Id: string, category: string, points: string, closeTime: Timestamp, open: boolean, winner: string };

function pickemResult(match: Match, pick: string) {
  if (match.winner === "-1") {
    return;
  }

  return (
    <div>
      <h1>
        {pick === match.winner ? (
          <>
          <Image src={correctImage} fluid />
          <Badge bg="secondary">+{match.points}</Badge>
          </>
        ) : (
          <>
          <Image src={incorrectImage} fluid />
          <Badge bg="secondary">+0</Badge>
          </>
        )}
        
      </h1>
    </div>
  );
}

export default pickemResult;