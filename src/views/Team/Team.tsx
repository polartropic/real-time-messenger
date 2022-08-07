import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getTeamByName } from '../../services/teams.services';
import { Team } from '../../types/Interfaces';

const MyTeam = (): JSX.Element => {
  const [team, setTeam] = useState<Team>({
    name: '',
    owner: '', // UserID
    members: [], // UserIDs
    channels: [], // ChannelIDs
  });
  const { name } = useParams<{ name?: string }>();
  console.log(name);

  useEffect(() => {
    getTeamByName(name!)
      .then((snapshot) => {
        setTeam(snapshot.val());
      })
      .catch(console.error);
  }, [name]);
  console.log(team);

  return (
    <>
      <p></p>
    </>
  );
};

export default MyTeam;
