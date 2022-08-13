import { deleteUserFromChat, removeUserFromChannel } from '../../services/channels.services';
import { createMeeting } from '../../services/meetings.services';
import { ToastContainer, toast } from 'react-toastify';
import { ChatParticipantsProps } from '../../types/Interfaces';
import { useContext, useState } from 'react';
import AppContext from '../../providers/AppContext';
import { uid } from 'uid';
import DatePicker from 'react-date-picker';
import TimePicker from 'react-time-picker';

import './ChatParticipants.css';
const ChatParticipants = ({ currentChannel, isDetailedChatClicked }: ChatParticipantsProps): JSX.Element | null => {
  const { appState } = useContext(AppContext);
  const userUsername = appState.userData?.username;
  const [isMeetingClicked, setIsMeetingClicked] = useState(false);
  const [date, setDate] = useState<Date>(new Date());
  const [startingHour, setStartingHour] = useState<Date | string>('10:00');
  const [endingHour, setEndingHour] = useState<Date | string>('10:00');
  const [name, setName] = useState<string>('');

  const handleCreateMeeting = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const convertedDate = date.toLocaleDateString('en-GB');
    createMeeting(name, convertedDate, startingHour, endingHour, currentChannel.participants)
      .then(() => toast.success('Successfully scheduled meeting!'));
  };

  const leaveChat = (username: string | undefined, chatName: string) => {
    deleteUserFromChat(username, chatName)
      .then(() => {
        toast.success(`You have successfully been removed from chat ${chatName}!`);
      });

    const currentUserIndex = currentChannel.participants.indexOf(userUsername!);

    removeUserFromChannel(currentChannel.id, currentUserIndex);
  };


  const mappingParticipants = (participant: string, key: string) => {
    return <div key={key}>
      <p className='participant-item'>{participant}</p>
    </div>;
  };

  return (
    isDetailedChatClicked ?
      <div className="participants-list">
        <button onClick={() => setIsMeetingClicked(!isMeetingClicked)} className="view-users-btn">Create a meeting</button>
        {isMeetingClicked?
          <form id='create-a-meeting' onSubmit={(e) => handleCreateMeeting(e)}>
            <h4>Create a meeting with chat participants:</h4>
            <p>Meeting name:
              <label htmlFor='content'></label>
              <input type="text" required placeholder="Input meeting's name" value={name} onChange={(e) => setName(e.target.value)}/>
            </p>
            <p>Meeting date:
              <DatePicker locale='en-GB' onChange={ setDate } value={date} />
            </p>
            <p>Meeting start:
              <TimePicker locale='en-GB' onChange={ setStartingHour} value={startingHour} />
            </p>
            <p>Meeting end:
              <TimePicker locale='en-GB' onChange={ setEndingHour} value={endingHour} />
            </p>
            <button className="view-users-btn">Schedule meeting</button>
          </form> :
          null
        }

        <h4>Owner:</h4>
        <h5>User0</h5>

        <h4>Participants of chat/team:</h4>
        {Object.values(currentChannel.participants).map((participant) => mappingParticipants(participant, uid()))}

        <div className="manage-participants-btns">
          <button className="add-btn"><span>Add members</span></button>
          <br />
          <button onClick={() => leaveChat(userUsername, currentChannel.title)} className="leave-btn">Leave channel</button>
        </div>
        <ToastContainer />
      </div> :
      null
  );
};

export default ChatParticipants;
