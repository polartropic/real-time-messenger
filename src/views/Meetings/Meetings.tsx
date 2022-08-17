import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useContext, useEffect, useState } from 'react';
import { getAllMeetings } from '../../services/meetings.services';
import AppContext from '../../providers/AppContext';
import { Meeting } from '../../types/Interfaces';
import './Meetings.css';
import { Link } from 'react-router-dom';

const localizer = momentLocalizer(moment);

const Meetings = (): JSX.Element => {
  const { appState } = useContext(AppContext);
  const userUsername = appState.userData?.username;
  const [events, setEvents] = useState<Meeting[]>([]);
  const [myMeetings, setMyMeetings] = useState<Meeting[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Meeting | undefined>(undefined);
  const [modalState, setModalState] = useState(false);

  useEffect(() => {
    getAllMeetings()
      .then((res) => setEvents(res.val()));
  }, []);

  useEffect(() => {
    const personalMeetings =
    (Object.values(events).filter((event) => Object.values(event.participants.filter((participant) => participant === userUsername))));
    const result = personalMeetings.map((meeting) => {
      return {
        title: meeting.title,
        start: new Date(meeting.start),
        end: new Date(meeting.end),
        participants: meeting.participants,
        id: meeting.id,
      };
    });

    setMyMeetings(result);
  }, [events, userUsername]);

  const onSelectEvent = (event: Meeting) => {
    setSelectedEvent(event);
    setModalState(true);
  };

  const MeetingDetails = () => {
    return (
      <div id='meeting-details'>
        <h4 id='meeting-details-title'>Meeting details:</h4>
        Title: {selectedEvent?.title} <br />
        Start: {selectedEvent?.start.toLocaleTimeString('en-GB')}<br />
        End: {selectedEvent?.end.toLocaleTimeString('en-GB')}<br />
        Participants: {selectedEvent?.participants.join(', ')} <br />
        Meeting ID: {selectedEvent?.id}
        <Link to={`/my-meetings/${selectedEvent?.id}`}>
          <button id='join-meeting-btn'>Join meeting</button>
        </Link>
      </div>
    );
  };

  return <div>
    {modalState === true ?
      <MeetingDetails/> :
      null}
    <Calendar
      localizer={localizer}
      events={myMeetings}
      startAccessor="start"
      endAccessor="end"
      selectable
      onSelectEvent={(e) => onSelectEvent(e)}
      style={{ height: 500 }} />
  </div>;
};

export default Meetings;
