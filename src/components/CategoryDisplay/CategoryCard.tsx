import CategoryChangeName from './CategoryChangeName';
import Card from 'react-bootstrap/Card';
import defaultImage from "../../assets/default.svg";

const CategoryCard = (id: string, category: {name: string, items: Map<string,string> }) => {
  return (
    <Card style={{ maxWidth: "286px", maxHeight:"360px" }}>
      <div style={{display: "flex", justifyContent: "center", backgroundColor:"grey"}}>
        <Card.Img style={{ paddingTop: "20px", paddingBottom: "20px", marginLeft:"auto", marginRight:"auto", width: "auto", maxHeight: "100px" }} variant="top" src={defaultImage} />
      </div>
      <Card.Body>
        <Card.Title>{category.name}</Card.Title>
        <CategoryChangeName id={id} category={category}/>
      </Card.Body>
    </Card>
  );
}

export default CategoryCard;