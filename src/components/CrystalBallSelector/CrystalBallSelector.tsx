import React from 'react';
import Button from 'react-bootstrap/Button';
import classNames from 'classnames';
import { pickemResult } from "..";
import defaultImage from "../../assets/faker.png"; // Correct image path

/**
 * Method that displays all the crystal ball pickems
 */

interface PickemBarProps {
  categories: Map<string, { name: string, items: Map<string, {img: string, name: string}> }>;
  crystalBallPickems: Map<string, {closeTime: any, img: string, points: string, title: string, winner: string}>
  userCrystalBall: { [key: number]: string };
}

function isOpen(match: { matchId: number; team1Id: string; team2Id: string; category: string; points: string; closeTime: any, open: boolean, winner: string, votes: {team1Vote: number, totalVote: number} }) {
  return match.open && match.closeTime.seconds > Date.now() / 1000;
}

const CrystalBallSelector = ({ categories, crystalBallPickems, userCrystalBall }: PickemBarProps) => {
  // Const for when pickems are not done by user
  const noPick: boolean = (userPick === "");
  const noUserPickTeam1 :boolean = (noPick && match.winner === match.team1Id);
  const noUserPickTeam2 :boolean = (noPick && match.winner === match.team2Id);

  // console.log(match.team1Id, match.team2Id , match.winner,"||", userPick)
  return (
    <>
    </>
  );
};

export default CrystalBallSelector;
