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
  let rank = 1;
  for (let i = 0; i < matchesData.length; i++) {
    // Edge case: at the end of the array -> Either all tied last or last one is last
    if (i + 1 === matchesData.length) {
      if (start !== -1) {
        while (start <= end) {
          matchesData[start].rank = rank;
          start++;
        }
      } else {
        matchesData[i].rank = rank;
      }
      break;
    }

    // if user ties with next score user
    if (matchesData[i].score === matchesData[i + 1].score) {
      if (start === -1) {
        start = i;
        end = i + 1;
      } else {
        end++;
      }
    // If not tied
    } else {
      // If not prev tied then the user has unique rank
      if (start === -1) {
        matchesData[i].rank = rank;
      } else {
      // Prev tied, henec all users prior to curr gets ranks
        while (start < end) {
          matchesData[start].rank = rank;
          start++;
        }

        start = -1;
        end = -1;
      }
    }

    rank++;
  }

  return matchesData;
}