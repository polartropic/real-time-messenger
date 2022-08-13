import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ChannelsList from '../../components/ChannelsList/ChannelsList';
import ChatParticipants from '../../components/ChatParticipants/ChatParticipants';
import Create from '../../components/Create/Create';
import { getLiveTeamChannels, getTeamByName } from '../../services/teams.services';
import { Team } from '../../types/Interfaces';
import Channel from '../../components/Channel/Channel';
import { Channel as IChannel } from '../../types/Interfaces';
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
  const [chatList, setChatList] = useState<IChannel[]>([]);
  const [members, setMembers] = useState<string[]>([]);
  const [currentChat, setCurrentChat] = useState<IChannel>({
    id: '',
    title: '',
    participants: [], // UserIDs
    messages: [],
    isPublic: false,
    teamID: '',
  });

  const { name } = useParams<{ name: string }>();

  useEffect(() => {
    getTeamByName(name!)
      .then((snapshot) => {
        const team = snapshot.val();
        setTeam(team);
      })
      .catch(console.error);
  }, [name]);

  const teamID = Object.keys(team)[0];

  useEffect(() => {
    const unsubscribe = getLiveTeamChannels(teamID, (snapshot) => {
      setChatList(snapshot.val());
    });
    return () => unsubscribe();
  }, [teamID]);

  useEffect(() => {
    setMembers(Object.values(team)[0].members);
  }, [team]);

  return (
    <div className='landing-page'>
      {team?.channels ?
        <ChannelsList props={{ chatList, setIsCreateChatClicked, setIsDetailedChatClicked, setCurrentChat }} /> :
        null}
      <ChannelsList props={{ chatList, setIsCreateChatClicked, setIsDetailedChatClicked, setCurrentChat }} />

      <div className='main-container'>
        <>
          {isCreateChatClicked ?

            < Create props={{
              isCreateChatClicked,
              setIsCreateChatClicked,
              teamID,
              members,
            }} /> :
            null
          }
          {isDetailedChatClicked ?
            <Channel currentChannel={currentChat} /> :
            null
          }
        </>
      </div>
      <ChatParticipants currentChannel={currentChat} isDetailedChatClicked={isDetailedChatClicked} />

    </div >
  );
};

export default MyTeam;
