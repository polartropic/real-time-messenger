import { uid } from 'uid';
import { getChatById, getChatByName } from '../../services/channels.services';
import { ChannelsListProps } from '../../types/Interfaces';


const ChannelsList = (
  { props }: ChannelsListProps) => {
  const mappingChats = (chatName: string) => {
    return <>
      <p onClick={() => openDetailedChat(chatName)} className='chat-item' key={uid()}>{chatName}</p>
    </>;
  };

  const openCreateChat = () => {
    props.setIsCreateChatClicked(true);
    props.setIsDetailedChatClicked(false);
    if (props.setIsCreateTeamView) {
      props.setIsCreateTeamView(false);
    }
  };
  const openDetailedChat = (chatName: string) => {
    props.setIsDetailedChatClicked(true);
    props.setIsCreateChatClicked(false);
    getChatByName(chatName)
      .then((res) => Object.keys(res.val()))
      .then((res) => getChatById(res[0]))
      .then((res) => props.setCurrentChat(res))
      .catch(console.error);
  };


  return (
    <div className="chats-channels-list">
      <button onClick={openCreateChat} className='view-users-btn'>Create a Chat</button>
      <h4>Chats:</h4>
      {props.userDetails ?
        props.userDetails.channels && Object.keys(props.userDetails!.channels).map((chat) => mappingChats(chat)) :
        props.chatList && props.chatList.map((chat) => mappingChats(chat.title))
      }

    </div>
  );
};

export default ChannelsList;
