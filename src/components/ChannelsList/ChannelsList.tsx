import { getChatById, getChatByName } from '../../services/channels.services';
import { ChannelsListProps } from '../../types/Interfaces';


const ChannelsList = (
  { props }: ChannelsListProps) => {
  const mappingChats = (chat: string) => {
    return <>
      <p onClick={() => openDetailedChat(chat)} className='chat-item'>{chat}</p>
    </>;
  };

  const openCreateChat = () => {
    props.setIsCreateChatClicked(true);
    props.setIsDetailedChatClicked(false);
    props.setIsCreateTeamView(false);
  };
  const openDetailedChat = (chat: string) => {
    props.setIsDetailedChatClicked(true);
    props.setIsCreateChatClicked(false);
    getChatByName(chat)
      .then((res) => Object.keys(res.val()))
      .then((res) => getChatById(res[0]))
      .then((res) => props.setCurrentChat(res))
      .catch(console.error);
  };


  return (
    <div className="chats-channels-list">
      <button onClick={openCreateChat} className='view-users-btn'>Create a Chat</button>
      <h4>Chats:</h4>
      {Object.keys(props.userDetails!.channels).map((chat) => mappingChats(chat))}

    </div>
  );
};

export default ChannelsList;
