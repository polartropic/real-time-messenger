import { DataSnapshot, get, onValue, push, ref, update } from 'firebase/database';
import { db } from '../config/firebase-config';
import { Message } from '../types/Interfaces';

export const getLiveMessages = (chatId: string, listen: (_snapshot: DataSnapshot) => void) => {
  return onValue(ref(db, `channels/${chatId}/messages`), listen);
};

export const fromMessagesDocument = (snapshot: DataSnapshot): Message[] => {
  if (!snapshot.exists()) return [];

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

export const addMessage = (chatId: string, username: string, content: string) => {
  return push(ref(db, `channels/${chatId}/messages`), {
    author: username,
    content,
    createdOn: Date.now(),
    likedBy: [],
  })
    .then((res) => {
      return getMessageById(chatId, res.key);
    });
};

export const addMessageImage = (chatId: string, username: string, fileURL: string) => {
  return push(ref(db, `channels/${chatId}/messages`), {
    author: username,
    content: '',
    fileURL: fileURL,
    createdOn: Date.now(),
    likedBy: [],
    image: true,
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

export const likeMessage = (chatId: string, messageId: string, username: string) => {
  const updateLikes: { [index: string]: boolean } = {};

  updateLikes[`channels/${chatId}/messages/${messageId}/likedBy/${username}`] = true;

  return update(ref(db), updateLikes);
};

export const unlikeMessage = (chatId: string, messageId: string, username: string) => {
  const updateLikes: { [index: string]: boolean | null } = {};

  updateLikes[`channels/${chatId}/messages/${messageId}/likedBy/${username}`] = null;

  return update(ref(db), updateLikes);
};
