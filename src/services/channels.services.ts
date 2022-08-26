import { ref, get, push, update, query, equalTo, orderByChild, DataSnapshot, onValue } from 'firebase/database';
import { db } from '../config/firebase-config';
import { Team, User } from '../types/Interfaces';

export const getAllChannels = () => {
  return get(query(ref(db, 'channels')));
};

export const getChatById = (id: string | null) => {
  return get(ref(db, `channels/${id}`))
    .then((result) => {
      if (!result.exists()) {
        throw new Error(`Channel with id ${id} does not exist!`);
      }

      const chat = result.val();
      chat.id = id;
      chat.date = new Date(chat.date);

      if (!chat.participants) {
        chat.participants = {};
      } else {
        chat.participants = Object.values(chat.participants);
      }

      return chat;
    });
};

export const createChat = (title: string, participants: string[] | User[]) => {
  return push(ref(db, 'channels'), {
    title,
    participants,
    messages: [],
    lastActivity: new Date(),
    isPublic: false,
  })
    .then((result) => getChatById(result.key));
};

export const createTeamChat = (teamID: string, title: string, participants: string[]) => {
  const updateTeamChats: { [index: string]: boolean } = {};
  updateTeamChats[`/teams/${teamID}/channels/${title}`] = true;

  return update(ref(db), updateTeamChats)
    .then(() => push(ref(db, 'channels'), {
      title,
      participants,
      messages: [],
      isPublic: false,
      teamID: teamID,
    }))
    .then((result) => getChatById(result.key));
};

export const getChatsByTeam = (team: Team) => {
  return getAllChannels()
    .then((snapshot) => console.log(Object.values(snapshot.val())
      .filter((ch: any) => Object.keys(team.channels).includes(ch.title))));
  // .filter((ch: Channel) => Object.keys(team.channels).includes(ch.title)));
};

export const deleteUserFromChat = (username: string | undefined, chatName: string) => {
  return update(ref(db), {
    [`users/${username}/channels/${chatName}`]: null,
  });
};

export const getChatByName = (chatName: string) => {
  return get(query(ref(db, 'channels'), orderByChild('title'), equalTo(chatName)));
};

export const removeUserFromChannel = (channelID: string, userIndex: number) => {
  return update(ref(db), {
    [`channels/${channelID}/participants/${userIndex}`]: null,
  });
};

export const updateChannelLastActivity = (channelID: string, date: number) => {
  return update(ref(db), {
    [`channels/${channelID}/lastActivity`]: date,
  });
};

export const getLiveNotifications = (chatId: string, listen: (_snapshot: DataSnapshot) => void) => {
  return onValue(ref(db, `channels/${chatId}/lastActivity`), listen);
};
