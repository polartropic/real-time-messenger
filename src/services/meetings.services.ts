import { ref, push, get } from 'firebase/database';
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
    })
    .catch(console.error);
};


export const createMeeting = (name: string, date: Date | string, startingHour: string | Date, endingHour: string | Date, participants: string[]) => {
  return push(ref(db, 'meetings'), {
    name,
    date,
    startingHour,
    endingHour,
    participants,
  })
    .then((res) => getMeetingByID(res.key))
    .catch(console.error);
};
