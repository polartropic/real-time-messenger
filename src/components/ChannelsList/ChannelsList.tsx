import { useContext } from 'react';
import { uid } from 'uid';
import AppContext from '../../providers/AppContext';
import { Channel, ChannelsListProps } from '../../types/Interfaces';
import './ChannelsList.css';

const ChannelsList = (
  { props }: ChannelsListProps) => {
  const {
    setIsCreateChatClicked,
    setIsDetailedChatClicked,
    setIsTeamView,
  } = useContext(AppContext);

  const mappingChats = (chanObj: Channel, key: string) => {
    return <div key={key}>
      <p onClick={() => openDetailedChat(chanObj)} className='chat-item'>{chanObj.title}</p>
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
    props.setCurrentChat(chanObj);
  };

  return (
    <div className='chats-channels-list'>
      <button onClick={openCreateChat} className='view-users-btn'>Create a Chat</button>
      <h4>Chats:</h4>
      <div className='chats'>
        {props.channels && props.channels.map((chanObj) => mappingChats(chanObj, uid()))}
      </div>
    </div>
  );
};

export default ChannelsList;
