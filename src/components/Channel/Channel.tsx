import { ChannelProps, Message as IMessage } from '../../types/Interfaces';
import { useContext, useEffect, useState } from 'react';
import { editMessage, fromMessagesDocument, getLiveMessages } from '../../services/messages.services';
import CreateMessage from '../CreateMessage/CreateMessage';
import Message from '../Message/Message';
import { addMessage } from '../../services/messages.services';
import AppContext from '../../providers/AppContext';
import './Channel.css';
import { updateChannelLastActivity } from '../../services/channels.services';
import { toast, ToastContainer } from 'react-toastify';

const Channel = ({ currentChannel }: ChannelProps) => {
  const { appState } = useContext(AppContext);
  const user = appState.userData;

  const [messages, setMessages] = useState<IMessage[]>([]);
  const [messageToBeEdited, setMessageToBeEdited] = useState<IMessage>();
  const [isInEditMode, setIsInEditMode] = useState(false);

  useEffect(() => {
    if (currentChannel.id === '') return;

    const unsubscribe = getLiveMessages(currentChannel.id, (snapshot) => {
      const processedMessages = fromMessagesDocument(snapshot);
      setMessages(processedMessages);
    });

    return () => unsubscribe();
  }, [currentChannel.id]);


  const handleEditMessage = (currentMessage: IMessage) => {
    setIsInEditMode(true);
    setMessageToBeEdited(currentMessage);
  };

  const handleSubmit = (message: string) => {
    console.log(message);
    if (message.trim().length > 0) {
      if (isInEditMode) {
        setIsInEditMode(false);
        editMessage(currentChannel?.id, messageToBeEdited?.id!, message)
          .catch(console.error);
      } else {
        addMessage(currentChannel.id, user?.username!, message)
          .then(() => updateChannelLastActivity(currentChannel.id, Date.now()))
          .catch(console.error);
      }
    } else {
      toast.warning('Please enter a message!');
    }
  };

  return (
    <div className='channel-container'>
      <h2>{currentChannel.title}</h2>

      <div className='messages-container'>
        {
          messages.length === 0 ?
            <p>Be the first to start a conversation</p> :
            messages.map((message, key) => <Message currentChannel={currentChannel}
              message={message} handleEditMessage={handleEditMessage} key={key} />)
        }
      </div>

      <CreateMessage handleSubmit={handleSubmit} existingMessage={messageToBeEdited?.content} />
      <ToastContainer/>
    </div>
  );
};

export default Channel;
