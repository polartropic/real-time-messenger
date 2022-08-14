import { useEffect, useState } from 'react';
import { getAllTeamsLive } from '../../services/teams.services';
import { getAllUsersLive } from '../../services/users.services';


const Footer = (): JSX.Element => {
  const [usersCount, setUsersCount] = useState(0);
  const [teamsCount, setTeamsCount] = useState(0);

  useEffect(() => {
    const unsubscribe = getAllUsersLive((snapshot) => {
      setUsersCount(snapshot.size);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = getAllTeamsLive((snapshot) => {
      setTeamsCount(snapshot.size);
    });
    return () => unsubscribe();
  }, []);

  return (
    <footer id='stats'>
      <h4 className='stats'>Total active users: {usersCount}</h4>
      <h4 className='stats'>Total active teams: {teamsCount}</h4>
    </footer>

  );
};

export default Footer;
