import './Channel.css';
import { ChannelProps, Message as IMessage } from '../../types/Interfaces';
import { useEffect, useState } from 'react';
import { fromMessagesDocument, getLiveMessages } from '../../services/messages.services';
import Message from '../Message/Message';
import CreateMessage from '../CreateMessage/CreateMessage';

const Channel = ({ currentChannel }: ChannelProps) => {
  const [messages, setMessages] = useState<IMessage []>([]);

  useEffect(() => {
    const unsubscribe = getLiveMessages((snapshot) => {
      setMessages(fromMessagesDocument(snapshot));
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="channel-container">
      <h4>Channel's title: {currentChannel.title}</h4>
      <hr />

      <p>Messages go here</p>
      <Message />

      <CreateMessage currentChannel={currentChannel}/>
    </div>
  );
};

export default Channel;
