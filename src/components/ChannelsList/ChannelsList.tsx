import { useContext, useState } from 'react';
import AppContext from '../../providers/AppContext';
import { getChatByName, getChatById } from '../../services/channels.services';
import { Channel, ChannelsListProps } from '../../types/Interfaces';
import Notifications from '../Notifications/Notifications';
import './ChannelsList.css';

const ChannelsList = ({ props }: ChannelsListProps) => {
  const {
    setIsCreateChatClicked,
    setIsDetailedChatClicked,
    setIsTeamView,
    setIsMeetingClicked,
  } = useContext(AppContext);

  const [activeChannel, setActiveChannel] = useState<Channel>({
    id: '',
    title: '',
    participants: [], // UserIDs
    messages: [],
    isPublic: false,
    teamID: '',
    lastActivity: new Date(),
  });

  const handleOpenChannel = (chanObj: Channel) => {
    openDetailedChat(chanObj);
    setActiveChannel(chanObj);
  };

  const mappingChats = (chanObj: Channel, key: number) => {
    return <div key={key} className='chat-items'>
      <p onClick={() => handleOpenChannel(chanObj)} className={activeChannel.title === chanObj.title ? 'chat-item-active' : 'chat-item'}>{chanObj.title}</p>
      <Notifications currentChannel={chanObj} activeChannel={activeChannel} />
    </div>;
  };

  const openCreateChat = () => {
    setIsCreateChatClicked(true);
    setIsDetailedChatClicked(false);
    setIsTeamView(false);
  };

  const openDetailedChat = (chanObj: Channel) => {
    setIsDetailedChatClicked(true);
    setIsCreateChatClicked(false);
    setIsTeamView(false);
    setIsMeetingClicked(false);
    getChatByName(chanObj.title)
      .then((res) => Object.keys(res.val()))
      .then((res) => getChatById(res[0]))
      .then((res) => props.setCurrentChat(res))
      .catch(console.error);
  };

  return (
    <div className='chats-channels-list'>
      <button onClick={openCreateChat} className='view-users-btn'>Create a Chat</button>
      <h4>Chats:</h4>
      <div className='chats'>
        {props.channels && props.channels.map((chanObj, index) => mappingChats(chanObj, index))}
      </div>
    </div>
  );
};

export default ChannelsList;
