import React from "react";
import { TeamRanking } from "../../defines";
import "./TournamentStanding.css"

interface TSProp {
  ranking: TeamRanking
}

const TournamentStanding: React.FC<TSProp> = (prop: TSProp) => {
    return (
    <table className="leaderboard-table">
      <thead>
      <tr>
        <th>Rank</th>
        <th>Team Name</th>
        <th>Points</th>
      </tr>
      </thead>
      {prop.ranking.map((value, index) => (
        <tr className={`rank-${index+1}`} style={{borderWidth: "1px"}}>
          <td className="rank" style={{borderWidth: "1px"}}>{index+1}</td>
          <td className="user">
            {/* <img src="https://placehold.co/45?text=AV" alt="Avatar" className="avatar"/> */}
            <span className="username">{value.name}</span>
          </td>
          <td className="points" style={{borderWidth: "1px"}}>{value.points}</td>
        </tr>
      ))}
      <tbody>
      {/* For each rank just display team */}
      </tbody>
    </table>
    )
};

export default TournamentStanding;