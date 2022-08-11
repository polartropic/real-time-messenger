import { ChannelProps, Message as IMessage } from '../../types/Interfaces';
import { useEffect, useState } from 'react';
import { fromMessagesDocument, getLiveMessages, getMessagesInChat } from '../../services/messages.services';
import CreateMessage from '../CreateMessage/CreateMessage';
import Message from '../Message/Message';
import './Channel.css';

const Channel = ({ currentChannel }: ChannelProps) => {
  const [messages, setMessages] = useState<IMessage []>([]);

  useEffect(() => {
    const unsubscribe = getLiveMessages((snapshot) => {
      setMessages(fromMessagesDocument(snapshot));
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    getMessagesInChat(currentChannel.id)
      .then((snapshot) => setMessages(snapshot))
      .catch(console.error);
  }, [currentChannel.id]);

  return (
    <div className='channel-container'>
      <h4>Channel's title: {currentChannel.title}</h4>
      <hr />

      {
        messages.length === 0 ?
          <p>No messages to show.</p> :
          messages.map((message, key) => <Message message={message} key={key} />)
      }

      <CreateMessage currentChannel={currentChannel}/>
    </div>
  );
};

export default Channel;
