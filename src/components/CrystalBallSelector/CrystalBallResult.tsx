import Badge from 'react-bootstrap/Badge';
import Image from 'react-bootstrap/Image';
import correctImage from "../../assets/Correct.png";
import incorrectImage from "../../assets/Incorrect.png";

type CrystalBallResultProps = {
  winnerId: string;
  winner: string;
  points: string;
  pick: string;
};

// Displays the results of a pickem (tick/cross with point value)
const CrystalBallResult = ({ winnerId, winner, points, pick }: CrystalBallResultProps) => {
  return (
    <div>
      <h1 style={{width:"160px"}}>
        {pick === winnerId ? (
          <>
            <Image src={correctImage} fluid style={{maxWidth: "45px", height:"auto" }}/>
            <Badge
              style={{ paddingLeft: "10px", paddingRight: "10px", marginLeft: "10px"}}
              bg="secondary"
            >
              +{points}
            </Badge>
          </>
        ) : (
          <>
            <Image src={incorrectImage} fluid style={{maxWidth: "45px", height:"auto" }}/>
            <Badge style={{ marginLeft: "10px" }} bg="secondary">
              +0
            </Badge>
          </>
        )}
      </h1>
    </div>
  );
};

export default CrystalBallResult;