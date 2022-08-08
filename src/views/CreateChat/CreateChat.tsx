import { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { MIN_CHANNEL_NAME_LENGTH, MAX_CHANNEL_NAME_LENGTH, MIN_NUMBER_OF_CHAT_PARTICIPANTS } from '../../common/constants';
import { createChat } from '../../services/channels.services';
import { updateUserChats } from '../../services/users.services';
import { User } from '../../types/Interfaces';


const CreateChat = ({ props }: any) => {
  const [chatDetails, setChatDetails] = useState({
    title: 'string',
    participants: [],
    isPublic: false,
  });


  const updateForm = (prop: string) => (e: React.FormEvent<HTMLInputElement>) => {
    setChatDetails({
      ...chatDetails,
      [prop]: e.currentTarget.value,
    });
  };

  const createChatFunc = (chatName: string, participants: string[] | User[]) => {
    if (chatDetails.title.length < MIN_CHANNEL_NAME_LENGTH || chatDetails.title.length > MAX_CHANNEL_NAME_LENGTH) {
      return toast.warning(`The name of the chat must be between ${MIN_CHANNEL_NAME_LENGTH} and ${MAX_CHANNEL_NAME_LENGTH} symbols`);
    }
    if (participants.length === MIN_NUMBER_OF_CHAT_PARTICIPANTS) {
      return toast.warning('Please add at least one participant in the chat!');
    }
    createChat(chatName, participants)
      .then(() => {
        toast.success('Successful chat creation!');
        props.setSearchTerm('');
        props.setisCreateChatClicked(!props.isCreateChatClicked);
        participants.map((participant) => updateUserChats(participant, chatName));
      })
      .catch(console.error);
  };

  return <>
    <div className='create-chat-view'>
      <div className='create-chat-form'>
        <div className="search-users">
          <label htmlFor="create-chat-title">Name of the chat:</label><br />
          <input type="text" className="create-chat-title" name="create-chat-title" placeholder="The name of your new chat" required defaultValue='' onChange={updateForm('title')} /> <br /> <br />
          <input type="text" defaultValue="" placeholder='search users...' onChange={(event) => props.setSearchTerm(event.target.value)} /> <br />
          <button className="view-users-btn" onClick={() => props.setisAllUsersClicked(!props.isAllUsersClicked)}>View all users</button>
        </div>
        {props.addedUsers.map(props.mappingResult)}
        <button className='create-a-team' onClick={() => createChatFunc(chatDetails.title, props.addedUsers.map((user: User) => user.username))}>Create a Chat</button>
      </div>
    </div>
    <ToastContainer/>
  </>;
};
export default CreateChat;
