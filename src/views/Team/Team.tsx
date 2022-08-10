import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ChannelsList from '../../components/ChannelsList/ChannelsList';
import ChatParticipants from '../../components/ChatParticipants/ChatParticipants';
import Create from '../../components/Create/Create';
import { getTeamByName } from '../../services/teams.services';
import { Team } from '../../types/Interfaces';
import Channel from '../Channel/Channel';
// import './Team.css'

const MyTeam = (): JSX.Element => {
  const [team, setTeam] = useState<Team>({
    name: '',
    owner: '', // UserID
    members: [], // UserIDs
    channels: [], // ChannelIDs
  });
  const [isDetailedChatClicked, setIsDetailedChatClicked] = useState(false);
  const [isCreateChatClicked, setIsCreateChatClicked] = useState(false);


  const [currentChat, setCurrentChat] = useState({
    date: {},
    id: '',
    isPublic: false,
    participants: [],
    title: '',
  });

  const { name } = useParams<{ name: string }>();
  console.log(name);

  useEffect(() => {
    getTeamByName(name!)
      .then((snapshot) => {
        console.log(snapshot.val());
        setTeam(snapshot.val());
      })
      .catch(console.error);
  }, [name]);
  console.log(team);

  return (
    <div className='landing-page'>
      {team?.channels ?
        <ChannelsList props={{ team, setIsCreateChatClicked, setIsDetailedChatClicked, setCurrentChat }} /> :
        null}
      <ChannelsList props={{ team, setIsCreateChatClicked, setIsDetailedChatClicked, setCurrentChat }} />

      <div className='main-container'>
        <>
          {isCreateChatClicked ?
            <Create props={{
              isCreateChatClicked,
              setIsCreateChatClicked,
            }} /> :
            null
          }
          {isDetailedChatClicked ?
            <Channel currentChannel={currentChat} /> :
            null
          }
        </>
      </div>
      <ChatParticipants currentChannel={currentChat} />

    </div >
  );
};

export default MyTeam;
