import { set, ref, get, query, orderByChild, equalTo, update, onValue, DataSnapshot } from 'firebase/database';
import { db } from '../config/firebase-config';

export const createUserByUsername = (firstName: string, lastName: string, phoneNumber: string,
  username: string, email: string | null, uid: string) => {
  return set(ref(db, `users/${username}`),
    { firstName, lastName, phoneNumber, username, email, uid, teams: [], channels: [], friends: [] },
  );
};

export const getUserByUsername = (username: string) => {
  return get(ref(db, `users/${username}`));
};

export const getLiveChannelsByUsername = (username: string, listen: (_snapshot: DataSnapshot) => void) => {
  return onValue(ref(db, `users/${username}/channels`), listen);
};

export const getLiveTeamsByUsername = (username: string, listen: (_snapshot: DataSnapshot) => void) => {
  return onValue(ref(db, `users/${username}/teams`), listen);
};

export const getLiveUserByUsername = (username: string, listen: (_snapshot: DataSnapshot) => void) => {
  return onValue(ref(db, `users/${username}`), listen);
};

export const getUserData = (uid: string) => {
  return get(query(ref(db, 'users'), orderByChild('uid'), equalTo(uid)));
};

export const getUserChannels = (username: string) => {
  return get(query(ref(db, `users/${username}/channels`)));
};

export const getAllUsers = () => {
  return get(query(ref(db, 'users')));
};

export const getAllUsersLive = (listen: (_snapshot: DataSnapshot) => void) => {
  return onValue(ref(db, 'users'), listen);
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

export const updateUserAvatar = (username: string, imgURL: string) => {
  const updateImgURL: { [index: string]: string } = {};
  updateImgURL[`/users/${username}/imgURL`] = imgURL;
  return update(ref(db), updateImgURL);
};


export const deleteUsersTeam = (username: string, teamName: string) => {
  const updateTeams: { [index: string]: boolean | null } = {};
  updateTeams[`/users/${username}/teams/${teamName}`] = null;
  return update(ref(db), updateTeams);
};

export const updateUserChats = (username: string, chatName: string) => {
  const updateChats: { [index: string]: boolean } = {};
  updateChats[`/users/${username}/channels/${chatName}`] = true;
  return update(ref(db), updateChats);
};

export const updateUserMessages = (username: string, messageID: string) => {
  const updateMessages: { [index: string]: boolean } = {};
  updateMessages[`/users/${username}/messages/${messageID}`] = true;
  return update(ref(db), updateMessages);
};
