import { set, ref, get } from 'firebase/database';
import { db } from '../config/firebase-config';

export const createUserByUsername= (firstName: string, lastName: string, phoneNumber: string,
  username: string, email: string | null, uid: string) => {
  return set(ref(db, `users/${username}`),
    { firstName, lastName, phoneNumber, username, email, uid, teams: [], channels: [], friends: [] },
  ).catch((e) => console.log(e));
};

export const getUserByUsername = (username: string) => {
  return get(ref(db, `users/${username}`));
};
