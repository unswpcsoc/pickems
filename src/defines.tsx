// Files containing crucial defines that are used throughout the project

import { Timestamp } from "firebase/firestore";

export enum TypesOfMatches {
  WinnerRound1 = "winnerround1",
  WinnerRound2 = "winnerround2",
  WinnerRound3 = "winnerround3",
  GrandFinals = "grandfinals",
  LoserRound1 = "loserround1",
  LoserRound2 = "loserround2",
  LoserRound3 = "loserround3",
  LoserRound4 = "loserround4",
  LosersFinals = "losersfinals",
};

export type CrystalBallEntry = {
  category: string;
  title: string;
  points: string;
  closeTime: Timestamp;
  winner: string;
  img: string;
  type: string;
};

