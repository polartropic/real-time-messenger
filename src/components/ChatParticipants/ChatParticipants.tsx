import axios from 'axios';
import { deleteUserFromChat, removeUserFromChannel } from '../../services/channels.services';
import { createMeeting } from '../../services/meetings.services';
import { ToastContainer, toast } from 'react-toastify';
import { ChatParticipantsProps, User } from '../../types/Interfaces';
import { useContext, useState } from 'react';
import AppContext from '../../providers/AppContext';
import { uid } from 'uid';
import DateTimePicker from 'react-datetime-picker';
import './ChatParticipants.css';
import { API_KEY, ORGANIZATION_ID } from '../../common/constants';
import UserComponent from '../User/User';

const ChatParticipants = ({ currentChannel,
  isDetailedChatClicked,
  setIsDetailedChatClicked,
  setIsDetailedTeamClicked,
  setIsCreateChatClicked,
  allUsers }: ChatParticipantsProps): JSX.Element | null => {
  const { appState } = useContext(AppContext);
  const userUsername = appState.userData?.username;

  const [isMeetingClicked, setIsMeetingClicked] = useState(false);
  const [name, setName] = useState<string>('');
  const [start, setStart] = useState<Date>(new Date());
  const [end, setEnd] = useState<Date>(new Date());

  const URL = window.location.href;

  const handleCreateMeeting = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const meetingCreation = {
      method: 'POST',
      url: `https://api.cluster.dyte.in/v1/organizations/${ORGANIZATION_ID}/meeting`,
      // eslint-disable-next-line quote-props
      headers: { 'Content-Type': 'application/json', Authorization: `${API_KEY}` },
      data: { title: name, authorization: { waitingRoom: false } },
    };

    axios.request(meetingCreation).then(function(response) {
      console.log(response.data);
      const convertedStart = start.toISOString();
      const convertedEnd = end.toISOString();
      createMeeting(name, convertedStart, convertedEnd, currentChannel.participants, response.data.data.meeting.id)
        .then(() => toast.success('Successfully scheduled meeting!'));
    })
      .catch(function(error) {
        console.error(error);
      });
  };

  const leaveChat = () => {
    deleteUserFromChat(userUsername, currentChannel.title)
      .then(() => {
        toast.success(`You have successfully been removed from chat ${currentChannel.title}!`);
      });

    const currentUserIndex = currentChannel.participants.indexOf(userUsername!);

    removeUserFromChannel(currentChannel.id, currentUserIndex);
  };

  const mappingParticipants = (participant: User, key: string) => {
    return <div key={key}>
      <UserComponent props={{ user: participant }}/>
    </div>;
  };

  const loadTeamDetails = () => {
    setIsDetailedChatClicked(false);
    if (setIsCreateChatClicked) {
      setIsCreateChatClicked(false);
    }
    if (setIsDetailedTeamClicked) {
      setIsDetailedTeamClicked(true);
    }
  };
  const currentChannelUsers = allUsers
    .filter((user) => currentChannel.participants.includes(user.username));
  return (
    isDetailedChatClicked ?
      <div className="participants-list">
        <button onClick={() => setIsMeetingClicked(!isMeetingClicked)} className="view-users-btn">Create a meeting</button>
        {isMeetingClicked ?
          <form id='create-a-meeting' onSubmit={handleCreateMeeting}>
            <h4>Create a meeting with chat participants:</h4>
            <p>Meeting name:
              <label htmlFor='content'></label>
              <input type="text" required placeholder="Input meeting's name" value={name} onChange={(e) => setName(e.target.value)} />
            </p>
            <p>Meeting start:
              <DateTimePicker onChange={setStart} value={start} />
            </p>
            <p>Meeting end:
              <DateTimePicker onChange={setEnd} value={end} />
            </p>
            <button className="view-users-btn">Schedule meeting</button>
          </form> :
          null
        }

        <h4>Chat:</h4>
        <h5>{currentChannel.title}</h5>

        <h4>Participants of chat:</h4>
        <div className='participants'>
          {currentChannelUsers.map((participant) => mappingParticipants(participant, uid()))}
        </div>

        <div className="manage-participants-btns">
          {URL.includes('/teams/') ?
            <button className="add-btn" onClick={() => loadTeamDetails()}><span>Team details</span></button> :
            null}
          <br />
          <button onClick={() => leaveChat()} className="leave-btn">Leave channel</button>
        </div>
        <ToastContainer />
      </div> :
      null
  );
};

export default ChatParticipants;
