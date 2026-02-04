// import Card from 'react-bootstrap/Card';
// import defaultImage from "../../assets/default.svg";
// import { Button, CardBody } from 'react-bootstrap';
// import { Form } from 'react-router-dom';

// const CrystalBallEditorCard = (pickemId: string, crystalBall: {category: string, closeTime: any, img: string, points: string, title: string, winner: string, type: string}, category: Map<string, {name: string, items: Map<string, {img: string, name: string}> }>) => {
//   return (
//     <Card style={{ maxWidth: "286px", maxHeight:"360px" }}>
//       <div style={{display: "flex", justifyContent: "center", backgroundColor:"grey"}}>
//         <Card.Img style={{ paddingTop: "20px", paddingBottom: "20px", marginLeft:"auto", marginRight:"auto", width: "auto", maxHeight: "100px" }} variant="top" src={defaultImage} />
//       </div>
//       <Card.Body>
//         <Card.Title>{crystalBall.title}</Card.Title>
//         <CardBody>Points: {crystalBall.points}</CardBody>
        
//         {/* submit crystal balls */}

//         {/* Get input */}
//         {/* Get button for it */}
//         {crystalBall.category === "numeric" ? (
//           <Form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
//             <Form.Group className="mb-3" controlId="formBasicEmail">
//               {/* <Form.Label>Email address</Form.Label> */}
//               <Form.Control 
//                 type="text"
//                 placeholder="Enter number (0, 1, 2, ...)"
//                 value={inputValue} 
//                 onChange={(e) => setInputValue(e.target.value)}
//               />
//             </Form.Group>

//             <Button variant="primary" type="submit">
//               Submit
//             </Button>
//           </Form>
//         ) : ()}

//       </Card.Body>
//     </Card>
//   );
// }

// export default CrystalBallEditorCard;