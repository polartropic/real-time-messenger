import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { useContext, useEffect, useState } from 'react';
import { getAllMeetings } from '../../services/meetings.services';
import AppContext from '../../providers/AppContext';
import { Meeting } from '../../types/Interfaces';
import SelectedMeeting from '../../components/SelectedMeeting/SelectedMeeting';
import './react-big-calendar.css';
import useStatusTracking from '../../hooks/useStatusTracking';

const localizer = momentLocalizer(moment);

const Meetings = (): JSX.Element => {
  const { appState } = useContext(AppContext);
  const userUsername = appState.userData?.username;

  const [events, setEvents] = useState<Meeting[]>([]);
  const [myMeetings, setMyMeetings] = useState<Meeting[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Meeting>({} as Meeting);
  const [modalState, setModalState] = useState(false);

  useStatusTracking(appState.userData!);

  useEffect(() => {
    getAllMeetings()
      .then((res) => setEvents(res.val()))
      .catch(console.error);
  }, []);

  useEffect(() => {
    const personalMeetings = (Object.values(events).filter((event) => event.participants.includes(userUsername!)));

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
    {modalState ?
      <SelectedMeeting selectedEvent={selectedEvent} setModalState={setModalState}/> :
      null
    }

    <Calendar
      localizer={localizer}
      events={myMeetings}
      startAccessor="start"
      endAccessor="end"
      selectable
      onSelectEvent={(e) => onSelectEvent(e)}
      style={{ height: 'calc(100vh - 80px)' }} />
  </div>;
};

export default Meetings;
