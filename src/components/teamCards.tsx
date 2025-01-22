import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import defaultImage from "../assets/default.svg";

const teamCard = (teamName: string, imageLocation:string) => {
  return (
    <Card style={{ width: '100%', maxWidth: "286px" }}>
      <Card.Img variant="top" src={imageLocation || defaultImage} />
      <Card.Body>
        <Card.Title>{teamName}</Card.Title>
        <Button variant="primary" style={{ marginRight: '8px' }}>Edit Name</Button>
        <Button variant="primary">Change Image</Button>
      </Card.Body>
    </Card>
  );
}

export default teamCard;