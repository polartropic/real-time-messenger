import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getTeamByName } from '../../services/teams.services';
import { Team } from '../../types/Interfaces';
import './Team.css';

const MyTeam = (): JSX.Element => {
  const [team, setTeam] = useState<Team>({
    name: '',
    owner: '', // UserID
    members: [], // UserIDs
    channels: [], // ChannelIDs
  });

  const [currentChat, setCurrentChat] = useState({
    date: {},
    id: '',
    isPublic: false,
    participants: [],
    title: '',
  });

  const { name } = useParams<{ name?: string }>();

  useEffect(() => {
    getTeamByName(name!)
      .then((snapshot) => {
        setTeam(snapshot.val());
      })
      .catch(console.error);
  }, [name]);
  console.log(team);

  return (
    <div className='landing-page'>
      <div className='chats-channels-list'>
        <p>Here's a paragraph in channels list</p>
      </div>
      <div className='main-container'>
        <p>Here's a paragraph in detailed chat</p>

      </div>
      <div className='participants-list'>
        <p>Here's a paragraph in participants list</p>

      </div>
    </div>
  );
};

export default MyTeam;
