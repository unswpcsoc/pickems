import CategoryChangeName from './CategoryChangeName';
import Card from 'react-bootstrap/Card';
import defaultImage from "../../../assets/default.svg";
import CategoryAddItems from './CategoryAddItems';
import CategoryViewItems from "./CategoryViewItems";
import { CategoryData } from '../../../defines';

const CategoryCard = (id: string, category: CategoryData) => {
  return (
    <Card style={{ maxWidth: "286px", maxHeight:"360px" }}>
      <div style={{display: "flex", justifyContent: "center", backgroundColor:"grey"}}>
        <Card.Img style={{ paddingTop: "20px", paddingBottom: "20px", marginLeft:"auto", marginRight:"auto", width: "auto", maxHeight: "100px" }} variant="top" src={defaultImage} />
      </div>
      <Card.Body>
        <Card.Title>{category.name}</Card.Title>
        <CategoryViewItems category={category}/>
        <CategoryChangeName id={id} category={category}/>
        <CategoryAddItems id={id} category={category}/>
      </Card.Body>
    </Card>
  );
}

export default CategoryCard;