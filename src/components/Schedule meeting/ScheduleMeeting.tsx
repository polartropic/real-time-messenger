import axios from 'axios';
import DateTimePicker from 'react-datetime-picker';
import { createMeeting } from '../../services/meetings.services';
import { API_KEY, BASE_URL, ORGANIZATION_ID } from '../../common/constants';
import { dyteMeetingCreationFunc } from '../../services/dyte.services';
import { useContext, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import AppContext from '../../providers/AppContext';
import { ScheduleMeetingProps } from '../../types/Interfaces';
import './ScheduleMeeting.css';
import './DateTimePicker.css';

const ScheduleMeeting = ({ currentChannel }: ScheduleMeetingProps): JSX.Element => {
  const { setIsMeetingClicked } = useContext(AppContext);

  const [name, setName] = useState<string>('');
  const [start, setStart] = useState<Date>(new Date());
  const [end, setEnd] = useState<Date>(new Date());

  const handleCreateMeeting = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    axios.request(dyteMeetingCreationFunc(BASE_URL, ORGANIZATION_ID, API_KEY, name))
      .then((response) => {
        const convertedStart = start.toISOString();
        const convertedEnd = end.toISOString();

        createMeeting(name, convertedStart, convertedEnd, currentChannel.participants, response.data.data.meeting.id)
          .then(() => toast.success('Successfully scheduled meeting!'))
          .then(() => setIsMeetingClicked(false));
      })
      .catch((error) => console.error(error));
  };
  return (
    <form id='create-a-meeting' onSubmit={handleCreateMeeting}>
      <h4>Create a meeting with chat participants:</h4>
      <p id='meeting-name'>Meeting name:
        <br />
        <label htmlFor='content'></label>
        <input type='text' required placeholder="Input meeting's name" value={name} onChange={(e) => setName(e.target.value)} />
      </p>

      <p id='meeting-start'>Meeting start:
        <br />
        <DateTimePicker format='dd-MM-yy HH:mm' onChange={setStart} value={start} />
      </p>
      <p id='meeting-end'>Meeting end:
        <br />
        <DateTimePicker format='dd-MM-yy HH:mm' onChange={setEnd} value={end} />
      </p>

      <button className='view-users-btn'>Schedule meeting</button>
      <ToastContainer />
    </form>
  );
};

export default ScheduleMeeting;
