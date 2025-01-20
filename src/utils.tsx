// Utility functions used throughout the project
// As this expands turn to separate files for the project

interface MatchData {
  userId: string;
  name: any;
  score: any;
  rank: any;
}

// I WILL REDO THIS ALGO TO BE NEATER :))
// Just made this algo (I will add proper flag variables later on I just wanted something out to show :))
// This algorithm is O(2n)=O(n) as it operates on an outer loop for all n-elements
// whilst the inner while loops only goes over same score/tied users once over.
export function rank_users(matchesData: MatchData[]): MatchData[] {
  let start = -1;
  let end = -1;
  let tie = false;

  let rank = 1;
  let tiedRank = 1;
  for (let i = 0; i < matchesData.length; i++) {
    // Edge case: at the end of the array -> Either all tied last or last one is last
    if (i + 1 === matchesData.length) {
      if (tie) {
        while (start <= end) {
          matchesData[start].rank = tiedRank;
          start++;
        }
      } else {
        matchesData[i].rank = rank;
      }
      break;
    }

    // if user ties with next score user
    if (matchesData[i].score === matchesData[i + 1].score) {
      // if not previously tied, then the tie flag is set
      if (!tie) {
        start = i;
        end = i + 1;
        tiedRank = rank;
        tie = true;
      } else {
        end++;
      }

    // If not tied with the next user
    } else {
      // and not tied with previous users, they get a unique rank.2
      if (!tie) {
        matchesData[i].rank = rank;
      } else {
      // but previously tied with other users, the start user to curr user share rank
        while (start <= end) {
          matchesData[start].rank = tiedRank;
          start++;
        }

        start = -1;
        end = -1;
        tie = false;
      }
    }

    rank++;
  }

  return matchesData;
}

// Function that takes an integer input and outputs a stringified version
// of the number with an ordinal suffix (e.g. 5 -> 5th)
export function getOrdinalSuffix(num: number): string {
  if (num >= 11 && num <= 19) {
    return num.toString() + "th";
  } else if (num % 10 === 1) {
    return num.toString() + "st";
  } else if (num % 10 === 2) {
    return num.toString() + "nd";
  } else if (num % 10 === 3) {
    return num.toString() + "rd";
  } else {
    return num.toString() + "th";
  }
}