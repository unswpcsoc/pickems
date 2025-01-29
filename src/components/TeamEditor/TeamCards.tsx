import ChangeTeamName from './ChangeTeamName';
import ChangeTeamColour from "./ChangeTeamColour";
import ChangeTeamLogo from "./ChangeTeamLogo";
import Card from 'react-bootstrap/Card';
import defaultImage from "../../assets/default.svg";

const TeamCard = (id: string, team: {name: string, teamColour: string, teamLogo: string }) => {
  return (
    <Card style={{ maxWidth: "286px", maxHeight:"360px" }}>
      <div style={{display: "flex", justifyContent: "center", backgroundColor:team.teamColour}}>
        <Card.Img style={{ paddingTop: "20px", paddingBottom: "20px", marginLeft:"auto", marginRight:"auto", width: "auto", maxHeight: "100px" }} variant="top" src={team.teamLogo || defaultImage} />
      </div>
      <Card.Body>
        <Card.Title>{team.name}</Card.Title>
        <ChangeTeamName id={id} teamData={team}/>
        <ChangeTeamColour id={id} teamData={team} />
        <ChangeTeamLogo id={id} teamData={team} />
      </Card.Body>
    </Card>
  );
}

export default TeamCard;