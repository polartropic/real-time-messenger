import { ChannelProps, Message as IMessage } from '../../types/Interfaces';
import { useContext, useEffect, useState } from 'react';
import { editMessage, fromMessagesDocument, getLiveMessages } from '../../services/messages.services';
import CreateMessage from '../CreateMessage/CreateMessage';
import Message from '../Message/Message';
import { addMessage } from '../../services/messages.services';
import AppContext from '../../providers/AppContext';
import './Channel.css';

const Channel = ({ currentChannel }: ChannelProps) => {
  const { appState } = useContext(AppContext);
  const user = appState.userData;

  const [messages, setMessages] = useState<IMessage []>([]);
  const [messageToBeEdited, setMessageToBeEdited] = useState<IMessage>();
  const [isInEditMode, setIsInEditMode] = useState(false);

  useEffect(() => {
    if (currentChannel.id === '') return;

    const unsubscribe = getLiveMessages(currentChannel.id, (snapshot) => {
      const processedMessages = fromMessagesDocument(snapshot);
      setMessages(processedMessages);
    });

    return () => unsubscribe();
  });

  const handleEditMessage = (currentMessage: IMessage) => {
    setIsInEditMode(true);
    setMessageToBeEdited(currentMessage);
  };

  const handleSubmit = (message: string) => {
    if (isInEditMode) {
      setIsInEditMode(false);
      editMessage(currentChannel?.id, messageToBeEdited?.id!, message)
        .catch(console.error);
    } else {
      addMessage(currentChannel?.id, user?.username!, message)
        .catch(console.error);
    }
  };

  return (
    <div className='channel-container'>
      <h2>{currentChannel.title}</h2>

      <div className='messages-container'>
        {
          messages.length === 0 ?
            <p>No messages to show.</p> :
            messages.map((message, key) => <Message currentChannel={currentChannel}
              message={message} handleEditMessage={handleEditMessage} key={key} />)
        }
      </div>

      <CreateMessage handleSubmit={handleSubmit} existingMessage={messageToBeEdited?.content} />
    </div>
  );
};

export default Channel;
