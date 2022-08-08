import { set, ref, get, query, orderByChild, equalTo, update } from 'firebase/database';
import { db } from '../config/firebase-config';
import { User } from '../types/Interfaces';

export const createUserByUsername = (firstName: string, lastName: string, phoneNumber: string,
  username: string, email: string | null, uid: string) => {
  return set(ref(db, `users/${username}`),
    { firstName, lastName, phoneNumber, username, email, uid, teams: [], channels: [], friends: [] },
  ).catch((e) => console.log(e));
};

export const getUserByUsername = (username: string) => {
  return get(ref(db, `users/${username}`));
};

export const getUserData = (uid: string) => {
  return get(query(ref(db, 'users'), orderByChild('uid'), equalTo(uid)));
};

export const getAllUsers = () => {
  return get(query(ref(db, 'users')));
};

export const updateFirstName = (username: string, firstName: string) => {
  return update(ref(db), {
    [`users/${username}/firstName`]: firstName,
  });
};

export const updateLastName = (username: string, lastName: string) => {
  return update(ref(db), {
    [`users/${username}/lastName`]: lastName,
  });
};

export const updatePhoneNumber = (username: string, phoneNumber: string) => {
  return update(ref(db), {
    [`users/${username}/phoneNumber`]: phoneNumber,
  });
};

export const updateEmail = (username: string, email: string) => {
  return update(ref(db), {
    [`users/${username}/email`]: email,
  });
};

export const updateUserTeams = (username: string, teamName: string) => {
  const updateTeams: { [index: string]: boolean } = {};
  updateTeams[`/users/${username}/teams/${teamName}`] = true;
  return update(ref(db), updateTeams);
};

export const updateUserChats = (username: string, chatName: string) => {
  const updateChats: { [index: string]: boolean } = {};
  updateChats[`/users/${username}/channels/${chatName}`] = true;
  return update(ref(db), updateChats);
};
