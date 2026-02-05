import { getOrdinalSuffix } from "../../utils";
import DataTable from 'react-data-table-component';
import { createTheme } from 'react-data-table-component';
createTheme('OP2', {
  text: {
    primary: "#ffffff"
  },
  background: {
    default: '#487e8c',
  },
});

type leaderboardProp = {
  leaderboard: Map<string, {
    inPerson: boolean;
    name: string;
    rank: number;
    score: number;
  }>[];
};

const FullLeaderboard = ({ leaderboard }: leaderboardProp) => {
  const columns = [
    {
      name: "Rank",
      selector: user => getOrdinalSuffix(user.rank),
      sortable: true,
      sortFunction: (a: any, b: any) => a.rank - b.rank,
    },
    {
      name: "Name",
      selector: user => (user.name + (user.inPerson ? "" : "*")),
      sortable: true,
    },
    {
      name: "Score",
      selector: user => user.score,
      sortable: true,
      sortFunction: (a: any, b: any) => a.score - b.score,
    },
  ]

  return (
    <DataTable
      title="Matches"
      columns={columns}
      data={leaderboard}
      defaultSortFieldId={1}
      theme='OP2'
    />
  );
};

export default FullLeaderboard;