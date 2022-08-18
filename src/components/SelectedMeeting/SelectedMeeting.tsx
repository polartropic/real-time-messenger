import { Link } from 'react-router-dom';
import { SelectedMeetingProps } from '../../types/Interfaces';
import './SelectedMeeting.css';

const SelectedMeeting = ( { selectedEvent }: SelectedMeetingProps) => {
  return (
    <div id='meeting-details'>
      <h4 id='meeting-details-title'>Meeting details:</h4>
        Title: {selectedEvent.title} <br />
        Start: {selectedEvent.start.toLocaleTimeString('en-GB')}<br />
        End: {selectedEvent.end.toLocaleTimeString('en-GB')}<br />
        Participants: {selectedEvent.participants.join(', ')} <br />
      <Link to={`/my-meetings/${selectedEvent.id}`}>
        <button id='join-meeting-btn'>Join meeting</button>
      </Link>
    </div>
  );
};

export default SelectedMeeting;
