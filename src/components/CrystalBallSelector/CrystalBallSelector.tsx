import CrystalBallCard from './CrystalBallCard';
import "./CrystalBallSelector.css"; // Assuming you have a CSS file for styling

/**
 * Method that displays all the crystal ball pickems
 */

interface PickemBarProps {  
  categories: Map<string, { name: string, items: Map<string, {img: string, name: string}> }>;
  crystalBallPickems: Map<string, {category: string, closeTime: any, img: string, points: string, title: string, winner: string, type: string}>
  userCrystalBall: { [key: string]: string };
}

const CrystalBallSelector = ({ categories, crystalBallPickems, userCrystalBall }: PickemBarProps) => {
  const groupedPickems: Map<string, any[]> = new Map();
  crystalBallPickems.forEach((pickem, id) => {
    if (!groupedPickems.has(pickem.type)) {
      groupedPickems.set(pickem.type, []);
    }
    groupedPickems.get(pickem.type)?.push({id, ...pickem});
  });

  const sortedGroupedPickems = new Map(
  [...groupedPickems.entries()].sort(([keyA], [keyB]) => {
    return keyA.localeCompare(keyB);
  })
);

  return (
    <>
      <div>
        {/* <h1 style={{textAlign:"center"}}>Crystal Balls have closed!</h1>
        <p style={{textAlign:"center"}}>Good luck on brackets pickems!</p> */}
        <div>
          {/* Render each type with its corresponding pickems */}
          {Array.from(sortedGroupedPickems.entries()).map(([type, pickems]) => {
            return (
              <div key={type} className="category-section">
                <h3 className="category-title">{type}</h3>

                <div className="crystal-ball-selector" style={{overflow: "visible"}}>
                  {pickems.map((pickem) => {
                    // If category is numeric, we will display it with a text box!
                    let items;
                    if (pickem.category === "Numeric") {
                      items = new Map();
                    } else {
                      const categoryData = categories.get(pickem.category);
                      items = categoryData?.items ?? new Map();
                    }
                  
                    return (
                      <CrystalBallCard
                        pickemId={pickem.id}
                        crystalBallPickem={pickem}
                        categoryItems={items}
                        userCrystalBall={userCrystalBall}
                        isNumeric={pickem.category === "Numeric"}
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default CrystalBallSelector;
