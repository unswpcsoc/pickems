import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import defaultImage from "../../assets/default.svg";

const TeamCard = (teamName: string, imageLocation:string) => {
  return (
    <Card style={{ width: '100%', maxWidth: "286px", maxHeight:"360px" }}>
      <Card.Img style={{ paddingTop: "20px", marginLeft:"auto", marginRight:"auto", width: "auto", maxHeight: "100px" }} variant="top" src={imageLocation || defaultImage} />
      <Card.Body>
        <Card.Title>{teamName}</Card.Title>
        <Button variant="primary">Edit Team</Button>
      </Card.Body>
    </Card>
  );
}

export default TeamCard;