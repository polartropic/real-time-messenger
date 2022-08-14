import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ChannelsList from '../../components/ChannelsList/ChannelsList';
import ChatParticipants from '../../components/ChatParticipants/ChatParticipants';
import Create from '../../components/Create/Create';
import { getLiveTeamChannels, getTeamByName } from '../../services/teams.services';
import { Team } from '../../types/Interfaces';
import Channel from '../../components/Channel/Channel';
import { Channel as IChannel } from '../../types/Interfaces';
import TeamParticipants from '../../components/TeamParticipants/TeamParticipants';
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
  const [teamProps, setTeamProps] = useState<Team>();

  const { name } = useParams<{ name: string }>();

  useEffect(() => {
    getTeamByName(name!)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const team: Team = snapshot.val();
          setTeam(team);
          setMembers(Object.values(team)[0].members);
          setTeamProps(Object.values(team)[0]);
        }
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
      {
        isDetailedChatClicked ?
          <ChatParticipants currentChannel={currentChat} isDetailedChatClicked={isDetailedChatClicked}
            setIsDetailedChatClicked={setIsDetailedChatClicked} /> :
          <TeamParticipants team={teamProps} isDetailedChatClicked={isDetailedChatClicked}
            setIsDetailedChatClicked={setIsDetailedChatClicked} />
      }

    </div >
  );
};

export default MyTeam;
