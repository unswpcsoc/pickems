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

export type TeamData = {
  name: string;
  teamColour: string;
  teamLogo: string;
}

export type SwissMatchData = {
  matchId: string;
  team1Id: string;
  team2Id: string;
  category: string;
  points: string;
  closeTime: Timestamp;
  open: boolean;
  winner: number;
  votes: {
    team1Votes: number;
    totalVotes: number;
  };
}

export type CategoryData = {
  name: string; // This is the name of the category
  items: Map<string, {
    name: string; // Name of each individual item
    img: string;
  }
  >;
}

export type TeamRanking = {
  name: string;
  points: number;
}[];

export type CrystalBallFormData = {
  category: string;
  title: string;
  points: string;
  closeTime: string;
  type: string;
}

export type CrystalBallEntry = {
  category: string;
  title: string;
  points: string;
  closeTime: Timestamp;
  winner: string;
  img: string;
  type: string;
};