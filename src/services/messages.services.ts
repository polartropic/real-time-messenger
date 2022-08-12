import { DataSnapshot, equalTo, get, onValue, orderByChild, push, query, ref, update } from 'firebase/database';
import { db } from '../config/firebase-config';
import { Message } from '../types/Interfaces';

export const getLiveMessages = (chatId: string, listen: (_snapshot: DataSnapshot) => void) => {
  return onValue(ref(db, `channels/${chatId}/messages`), listen);
};

export const fromMessagesDocument = (snapshot: DataSnapshot): Message [] => {
  if (snapshot.exists()) {
    const messagesDocument = snapshot.val();

    return Object.keys(messagesDocument).map((key) => {
      const message = messagesDocument[key];

      return {
        ...message,
        id: key,
        createdOn: new Date(message.createdOn),
        likedBy: message.likedBy ? Object.keys(message.likedBy) : [],
      };
    });
  };
  return [];
};

export const addMessage = (chatId: string, username: string, content: string) => {
  return push(ref(db, `channels/${chatId}/messages`), {
    author: username,
    content,
    createdOn: Date.now(),
  })
    .then((res) => {
      return getMessageById(chatId, res.key);
    });
};

export const editMessage = (chatId: string, messageId: string, content: string) => {
  return update(ref(db), {
    [`channels/${chatId}/messages/${messageId}/content`]: content,
  });
};

export const getMessageById = (chatId: string, messageId: string | null) => {
  return get(ref(db, `channels/${chatId}/messages/${messageId}`))
    .then((res) => {
      if (!res.exists()) {
        throw new Error(`Message with id ${messageId} does not exist!`);
      }

      const message = res.val();
      message.id = messageId;
      message.createdOn = new Date(message.createdOn);

      if (!message.likedBy) {
        message.likedBy = [];
      } else {
        message.likedBy = Object.keys(message.likedBy);
      }

      return message;
    });
};

export const getMessagesByAuthor = (chatId: string, username: string) => {
  return get(query(ref(db, `channels/${chatId}/messages`), orderByChild('author'), equalTo(username)))
    .then((snapshot: DataSnapshot) => {
      if (!snapshot.exists()) return [];

      return fromMessagesDocument(snapshot);
    });
};

export const getMessagesInChat = (chatId: string) => {
  return get(query(ref(db, `channels/${chatId}/messages`)))
    .then((snapshot) => {
      if (!snapshot.exists()) {
        return [];
      }

      return fromMessagesDocument(snapshot);
    });
};

export const likeMessage = (chatId: string, messageId: string, username: string) => {
  const updateLikes: any = {};

  updateLikes[`channels/${chatId}/messages/${messageId}/likedBy/${username}`] = true;
  updateLikes[`users/${username}/likedMessages/${messageId}`] = true;

  return update(ref(db), updateLikes);
};

export const unlikeMessage = (chatId: string, messageId: string, username: string) => {
  const updateLikes: any = {};

  updateLikes[`channels/${chatId}/messages/${messageId}/likedBy/${username}`] = null;
  updateLikes[`users/${username}/likedMessages/${messageId}`] = null;

  return update(ref(db), updateLikes);
};
