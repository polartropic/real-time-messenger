import axios from 'axios';
import { deleteUserFromChat, removeUserFromChannel } from '../../services/channels.services';
import { dyteMeetingCreationFunc } from '../../services/dyte.services';
import { createMeeting } from '../../services/meetings.services';
import { ToastContainer, toast } from 'react-toastify';
import { ChatParticipantsProps, User } from '../../types/Interfaces';
import { useContext, useState } from 'react';
import AppContext from '../../providers/AppContext';
import { uid } from 'uid';
import DateTimePicker from 'react-datetime-picker';
import { API_KEY, BASE_URL, ORGANIZATION_ID } from '../../common/constants';
import UserComponent from '../User/User';
import './ChatParticipants.css';

const ChatParticipants = ({ currentChannel, allUsers, owner }: ChatParticipantsProps): JSX.Element | null => {
  const { appState,
    isTeamView,
    isDetailedChatClicked,
    setIsCreateChatClicked,
    setIsDetailedChatClicked,
    setIsTeamView,
  } = useContext(AppContext);

  const userUsername = appState.userData?.username;

  const [isMeetingClicked, setIsMeetingClicked] = useState(false);
  const [name, setName] = useState<string>('');
  const [start, setStart] = useState<Date>(new Date());
  const [end, setEnd] = useState<Date>(new Date());

  const URL = window.location.href;
  if (owner && currentChannel.participants.includes(owner?.username) &&
    allUsers.every((user) => user.username !== owner?.username)) {
    allUsers = [...allUsers, owner];
  }

  const handleCreateMeeting = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    axios.request(dyteMeetingCreationFunc(BASE_URL, ORGANIZATION_ID, API_KEY, name))
      .then((response) => {
        const convertedStart = start.toISOString();
        const convertedEnd = end.toISOString();

        createMeeting(name, convertedStart, convertedEnd, currentChannel.participants, response.data.data.meeting.id)
          .then(() => toast.success('Successfully scheduled meeting!'));
      })
      .catch((error) => console.error(error));
  };

  const leaveChat = () => {
    deleteUserFromChat(userUsername, currentChannel.title)
      .then(() => {
        toast.success(`You have successfully been removed from chat ${currentChannel.title}!`);
        setIsDetailedChatClicked(false);
      });

    const currentUserIndex = currentChannel.participants.indexOf(userUsername!);

    removeUserFromChannel(currentChannel.id, currentUserIndex);
  };

  const mappingParticipants = (participant: User, key: string) => {
    return <div key={key}>
      <UserComponent props={{ user: participant }} />
    </div>;
  };

  const loadTeamDetails = () => {
    setIsDetailedChatClicked(false);
    setIsCreateChatClicked(false);
    setIsTeamView(true);
  };

  const currentChannelUsers = allUsers
    .filter((user) => currentChannel.participants.includes(user.username));

  return (
    isDetailedChatClicked ?
      <div className='participants-list'>
        <button onClick={() => setIsMeetingClicked(!isMeetingClicked)} className='view-users-btn'>Create a meeting</button>
        {isMeetingClicked ?
          <form id='create-a-meeting' onSubmit={handleCreateMeeting}>
            <h4>Create a meeting with chat participants:</h4>
            <p>Meeting name:
              <label htmlFor='content'></label>
              <input type='text' required placeholder="Input meeting's name" value={name} onChange={(e) => setName(e.target.value)} />
            </p>
            <p id='meeting-start'>Meeting start:
              <DateTimePicker onChange={setStart} value={start} />
            </p>
            <p id='meeting-end'>Meeting end:
              <DateTimePicker onChange={setEnd} value={end} />
            </p>
            <button className='view-users-btn'>Schedule meeting</button>
          </form> :
          null
        }

        <h4>Participants of chat:</h4>
        <div className='participants'>
          {currentChannelUsers.map((participant) => mappingParticipants(participant, uid()))}
        </div>

        <div className='manage-participants-btns'>
          {URL.includes('/teams/') ?
            <button className='add-btn' onClick={() => loadTeamDetails()}><span>Team details</span></button> :
            null}
          <br />
          <button onClick={() => leaveChat()} className='leave-btn'>Leave channel</button>
        </div>
        <ToastContainer />
      </div> :
      <div className='participants-list'>
      </div>
  );
};

export default ChatParticipants;
