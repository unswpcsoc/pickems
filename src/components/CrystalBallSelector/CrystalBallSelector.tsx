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


  return (
    <>
      <div>
        <div>
          {/* Render each type with its corresponding pickems */}
          {Array.from(groupedPickems.entries()).map(([type, pickems]) => {            
            return (
              <div key={type} className="category-section">
                <h3 className="category-title">{type}</h3>

                <div className="crystal-ball-selector">
                  {pickems.map((pickem) => {
                    const categoryData = categories.get(pickem.category);
                    const items = categoryData?.items ?? new Map();
                    return (
                      <CrystalBallCard
                        pickemId={pickem.id}
                        crystalBallPickem={pickem}
                        categoryItems={items}
                        userCrystalBall={userCrystalBall}
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
        {/* <div className="crystal-ball-selector">
          {Array.from(crystalBallPickems.entries()).map(([pickemId, pickem]) => {
            const categoryData = categories.get(pickem.category);
            const items = categoryData?.items ?? new Map();

            return (
              <CrystalBallCard pickemId={pickemId} crystalBallPickem={pickem} categoryItems={items} userCrystalBall={userCrystalBall} />
            )
          })}
        </div> */}
      </div>
    </>
  );
};

export default CrystalBallSelector;
