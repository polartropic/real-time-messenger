import { deleteUserFromChat } from '../../services/channels.services';
import { ToastContainer, toast } from 'react-toastify';
import { ChannelProps } from '../../types/Interfaces';
import { useContext } from 'react';
import AppContext from '../../providers/AppContext';

const ChatParticipants = ({ currentChannel }: ChannelProps): JSX.Element => {
  const { appState } = useContext(AppContext);
  const userUsername = appState.userData?.username;

  const leaveChat = (username: string | undefined, chatName: string) => {
    deleteUserFromChat(username, chatName)
      .then(() => {
        toast.success(`You have successfully been removed from chat ${chatName}!`);
      });
  };

  const mappingParticipants = (participant: string) => {
    return <>
      <p className='participant-item'>{participant}</p>
    </>;
  };

  return (
    <div className="participants-list">
      <h4>Owner:</h4>
      <p>User0</p>

      <h4>Participants of chat/team:</h4>
      {Object.values(currentChannel.participants).map((participant) => mappingParticipants(participant))}

      <div className="manage-participants-btns">
        <button className="add-btn"><span>Add members</span></button>
        <br />
        <button onClick={() => leaveChat(userUsername, currentChannel.title)} className="leave-btn">Leave channel</button>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ChatParticipants;
