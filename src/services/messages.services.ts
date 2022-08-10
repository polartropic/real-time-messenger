import { DataSnapshot, get, onValue, push, ref } from 'firebase/database';
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


export const addMessage = (content: string, username: string) => {
  return push(ref(db, 'messages'), { content, author: username, createdOn: Date.now() })
    .then((res)=> {
      return getMessageByID(res.key!);
    });
};

export const getMessageByID = (id: string) => {
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
