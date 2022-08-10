import { DataSnapshot, equalTo, get, onValue, orderByChild, push, query, ref, update } from 'firebase/database';
import { db } from '../config/firebase-config';

export const getLiveMessages = (listen: (_snapshot: DataSnapshot) => void) => {
  return onValue(ref(db, 'messages'), listen);
};

export const fromMessagesDocument = (snapshot: DataSnapshot) => {
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

export const addMessage = (username: string, content: string) => {
  return push(ref(db, 'messages'), {
    author: username,
    content,
    createdOn: Date.now(),
  })
    .then((res)=> {
      return getMessageById(res.key);
    });
};

export const editMessage = (id: string, content: string) => {
  return update(ref(db), {
    [`messages/${id}/content`]: content,
  });
};

export const getMessageById = (id: string | null) => {
  return get(ref(db, `messages/${id}`))
    .then((res) => {
      if (!res.exists()) {
        throw new Error(`Message with id ${id} does not exist!`);
      }

      const message = res.val();
      message.id = id;
      message.createdOn = new Date(message.createdOn);

      if (!message.likedBy) {
        message.likedBy = [];
      } else {
        message.likedBy = Object.keys(message.likedBy);
      }

      return message;
    });
};

export const getMessagesByAuthor = (username: string) => {
  return get(query(ref(db, 'messages'), orderByChild('author'), equalTo(username)))
    .then((snapshot: DataSnapshot) => {
      if (!snapshot.exists()) return [];

      return fromMessagesDocument(snapshot);
    });
};

export const likeMessage = (username: string, messageId: string) => {
  const updateLikes: any = {};

  updateLikes[`/messages/${messageId}/likedBy/${username}`] = true;
  updateLikes[`/users/${username}/likedMessages/${messageId}`] = true;

  return update(ref(db), updateLikes);
};

export const unlikeMessage = (username: string, messageId: string) => {
  const updateLikes: any = {};

  updateLikes[`/messages/${messageId}/likedBy/${username}`] = null;
  updateLikes[`/users/${username}/likedMessages/${messageId}`] = null;

  return update(ref(db), updateLikes);
};
