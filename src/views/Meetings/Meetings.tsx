import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import './react-big-calendar.css';
import { useContext, useEffect, useState } from 'react';
import { getAllMeetings } from '../../services/meetings.services';
import AppContext from '../../providers/AppContext';
import { Meeting } from '../../types/Interfaces';
import './Meetings.css';
import SelectedMeeting from '../../components/SelectedMeeting/SelectedMeeting';

const localizer = momentLocalizer(moment);

const Meetings = (): JSX.Element => {
  const { appState } = useContext(AppContext);
  const userUsername = appState.userData?.username;
  const [events, setEvents] = useState<Meeting[]>([]);
  const [myMeetings, setMyMeetings] = useState<Meeting[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Meeting>({
    title: '',
    start: new Date(),
    end: new Date(),
    participants: [],
    id: '',
  });
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

  return <div>
    {modalState === true ?
      <SelectedMeeting selectedEvent={selectedEvent}/> :
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
