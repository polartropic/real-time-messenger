import { ChannelProps, Message as IMessage } from '../../types/Interfaces';
import { useEffect, useState } from 'react';
import { fromMessagesDocument, getLiveMessages } from '../../services/messages.services';
import CreateMessage from '../CreateMessage/CreateMessage';
import Message from '../Message/Message';
import './Channel.css';

const Channel = ({ currentChannel }: ChannelProps) => {
  const [messages, setMessages] = useState<IMessage []>([]);

  useEffect(() => {
    if (currentChannel.id === '') return;

    const unsubscribe = getLiveMessages(currentChannel.id, (snapshot) => {
      const processedMessages = fromMessagesDocument(snapshot);
      setMessages(processedMessages);
    });

    return () => unsubscribe();
  });

  return (
    <div className='channel-container'>
      <h4>Channel's title: {currentChannel.title}</h4>
      <hr />

      <div className='messages-container'>
        {
          messages.length === 0 ?
            <p>No messages to show.</p> :
            messages.map((message, key) => <Message currentChannel={currentChannel} message={message} key={key} />)
        }
      </div>

      <CreateMessage currentChannel={currentChannel}/>
    </div>
  );
};

export default Channel;
