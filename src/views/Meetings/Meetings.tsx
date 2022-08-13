import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useContext, useEffect, useState } from 'react';
import { getAllMeetings } from '../../services/meetings.services';
import AppContext from '../../providers/AppContext';
import { Meeting } from '../../types/Interfaces';
const localizer = momentLocalizer(moment);

const Meetings = (): JSX.Element => {
  const { appState } = useContext(AppContext);
  const userUsername = appState.userData?.username;
  const [events, setEvents] = useState<Meeting[]>([]);
  const [myMeetings, setMyMeetings] = useState<Meeting[]>([]);

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
      };
    });

    setMyMeetings(result);
  }, [events, userUsername]);


  return <div>
    <Calendar
      localizer={localizer}
      events={myMeetings}
      startAccessor="start"
      endAccessor="end"
      style={{ height: 500 }} />
  </div>;
};

export default Meetings;
