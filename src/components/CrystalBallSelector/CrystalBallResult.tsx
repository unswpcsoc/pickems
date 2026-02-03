import Badge from 'react-bootstrap/Badge';
import Image from 'react-bootstrap/Image';
import correctImage from "../../assets/Correct.png";
import incorrectImage from "../../assets/Incorrect.png";

// Displays the results of a pickem (tick/cross with point value)
const CrystalBallResult = (correct: boolean, points: string) => {
  return (
    <div>
      <h1 style={{display:"flex", alignItems: "center"}}>
        {correct === true ? (
          <>
            <Image src={correctImage} fluid />
            <Badge style={{paddingLeft:"10px", paddingRight:"10px", marginLeft:"10px"}} bg="secondary">+{points}</Badge>
          </>
          ) : (
          <>
            <Image style={{ width:"45%", height:"45%" }} src={incorrectImage} fluid />
            <Badge style={{ marginLeft:"10px" }} bg="secondary">+0</Badge>
          </>
          )
        }
        
      </h1>
    </div>
  );
}

export default CrystalBallResult;