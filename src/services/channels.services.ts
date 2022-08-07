import { ref, get, push } from 'firebase/database';
import { db } from '../config/firebase-config';

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
        chat.participants = [];
      } else {
        chat.participants = Object.keys(chat.participants);
      }

      return chat;
    })
    .catch(console.error);
};


export const createChat = (title: string, participants: string[]) => {
  return push(ref(db, 'channels'), {
    title,
    participants,
    isPublic: false,

  })
    .then((res) => getChatById(res.key))
    .catch(console.error);
};
