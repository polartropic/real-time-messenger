import { useContext } from 'react';
import { uid } from 'uid';
import AppContext from '../../providers/AppContext';
import { getChatById, getChatByName } from '../../services/channels.services';
import { ChannelsListProps } from '../../types/Interfaces';
import './ChannelsList.css';

const ChannelsList = (
  { props }: ChannelsListProps) => {
  const {
    isTeamView,
    setIsCreateChatClicked,
    setIsDetailedChatClicked,
    setIsTeamView,
  } = useContext(AppContext);

  const mappingChats = (chatName: string, key: string) => {
    return <div key={key}>
      <p onClick={() => openDetailedChat(chatName)} className='chat-item'>{chatName}</p>
    </div>;
  };

  const openCreateChat = () => {
    setIsCreateChatClicked(true);
    setIsDetailedChatClicked(false);
    if (isTeamView) {
      setIsTeamView(false);
    }
    if (setIsTeamView) {
      setIsTeamView(false);
    }
  };

  const openDetailedChat = (chatName: string) => {
    setIsDetailedChatClicked(true);
    setIsCreateChatClicked(false);
    if (setIsTeamView) {
      setIsTeamView(false);
    }

    if (setIsTeamView) {
      setIsTeamView(false);
    }

    getChatByName(chatName)
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
        {props.channels && props.channels.map((chat) => mappingChats(chat, uid()))}
      </div>
    </div>
  );
};

export default ChannelsList;
