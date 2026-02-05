import Card from 'react-bootstrap/Card';
import defaultImage from "../../../assets/default.svg";
import { Button, CardBody } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import { editCrystalBallPickemToDatabase, submitAnswerCrystalBall } from '../../../firebase/database';
import { useState } from 'react';
import { db } from '../../../firebase';
import { CrystalBallEntry } from '../../../defines';

type CrystalBallEditorCardProps = {
  pickemId: string;
  crystalBall: CrystalBallEntry;
  category: Map<
    string,
    {
      name: string;
      items: Map<string, { img: string; name: string }>;
    }
  >;
};

const CrystalBallEditorCard = ({pickemId, crystalBall, category}: CrystalBallEditorCardProps) => {
    let [crystalBallData, setCrystalBallData] = useState<CrystalBallEntry>({
        category: crystalBall.category,
        title: crystalBall.title,
        points: crystalBall.points,
        closeTime: crystalBall.closeTime,
        winner: crystalBall.winner,
        img: crystalBall.img,
        type: crystalBall.type
    });
    
    let [answer, setAnswer] = useState("");
    
    const editCrystalBall = async () => {
        const success = await editCrystalBallPickemToDatabase(db, crystalBallData, pickemId);
        if (success) {
            // something
        } else {
            console.error("Error updating crystal pickem:", success);
        }
    };

    const submitAnswer = async () => {
        console.log("fdfs")
        const success = await submitAnswerCrystalBall(db, crystalBallData, answer, pickemId);
        if (success) {
            // something
            console.log("here it is")
            console.log(crystalBallData)
        } else {
            console.error("Error submitting answer", success);
        }
    };
  
    return (
    <Card style={{ maxWidth: "286px" }}>
      <div style={{display: "flex", justifyContent: "center", backgroundColor:"grey"}}>
        <Card.Img style={{ paddingTop: "20px", paddingBottom: "20px", marginLeft:"auto", marginRight:"auto", width: "auto", maxHeight: "100px" }} variant="top" src={defaultImage} />
      </div>
      <Card.Body>
        <Card.Title>{crystalBall.title}</Card.Title>
        <CardBody>Points: {crystalBall.points}</CardBody>
        <CardBody>{pickemId}</CardBody>
        
        <Form onSubmit={editCrystalBall} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
            {/* <Form.Label>Email address</Form.Label> */}
            <Form.Control 
            type="text"
            placeholder="Change Title"
            // value={crystalBall} 
            // onChange={}
            />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicEmail">
            {/* <Form.Label>Email address</Form.Label> */}
            <Form.Control 
            type="text"
            placeholder="Answer"
            // value={crystalBall} 
            // onChange={}
            />
        </Form.Group>

        <Button variant="primary" type="submit">
            Submit Changes
        </Button>
        </Form>

        <Form style={{ display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Control 
            type="text"
            placeholder="Answer"
            value={answer} 
            onChange={(e) => setAnswer(e.target.value)}
            />
        </Form.Group>

        <Button variant="primary" type="button" onClick={submitAnswer} disabled={false}>
            Submit Answer
        </Button>
        </Form>

      </Card.Body>
    </Card>
  );
}

export default CrystalBallEditorCard;