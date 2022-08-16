import { ref, push, get, query } from 'firebase/database';
import { db } from '../config/firebase-config';

export const getMeetingByID = (id: string | null) => {
  return get(ref(db, `meetings/${id}`))
    .then((result) => {
      if (!result.exists()) {
        throw new Error(`Meeting with id ${id} does not exist!`);
      }

      const meeting = result.val();
      meeting.id = id;

      if (!meeting.participants) {
        meeting.participants = [];
      } else {
        meeting.participants = Object.keys(meeting.participants);
      }

      return meeting;
    });
};

export const createMeeting = (title: string, start: string, end: string, participants: string[]) => {
  return push(ref(db, 'meetings'), {
    title,
    start,
    end,
    participants,
  })
    .then((res) => getMeetingByID(res.key));
};

export const getAllMeetings = () => {
  return get(query(ref(db, 'meetings')));
};
