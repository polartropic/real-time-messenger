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
import Dropzone from 'react-dropzone';
import { uploadImageMessage } from '../../services/storage.services';


const Channel = ({ currentChannel }: ChannelProps) => {
  const { appState } = useContext(AppContext);
  const user = appState.userData;
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [messageToBeEdited, setMessageToBeEdited] = useState<IMessage>();
  const [isInEditMode, setIsInEditMode] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File>();
  const [preview, setPreview] = useState<string>();


  useEffect(() => {
    if (currentChannel.id === '') return;

    const unsubscribe = getLiveMessages(currentChannel.id, (snapshot) => {
      const processedMessages = fromMessagesDocument(snapshot);
      setMessages(processedMessages);
    });

    return () => unsubscribe();
  }, [currentChannel.id]);

  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const onSelectFile = (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) {
      setSelectedFile(undefined);
      return;
    }
    // I've kept this example simple by using the first image instead of multiple
    setSelectedFile(acceptedFiles[0]);
  };

  const handleUploadFile = () => {
    if (selectedFile) {
      uploadImageMessage(selectedFile, currentChannel.id, user?.username!);
      setSelectedFile(undefined);
    }
  };


  const handleEditMessage = (currentMessage: IMessage) => {
    setIsInEditMode(true);
    setMessageToBeEdited(currentMessage);
  };

  const handleSubmit = (message: string) => {
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
              message={message} handleEditMessage={handleEditMessage} key={key}
              toBeEdited={messageToBeEdited === message} />)
        }
      </div>
      {selectedFile &&
        <div>
          <img src={preview} alt='selected file' className='sample-upload' />
          <button type='submit' className='send-btn' value='' onClick={() => handleUploadFile()}>
            <i className="fa-solid fa-check"></i>
          </button>

        </div>}
      <Dropzone onDrop={onSelectFile}>
        {({ getRootProps, getInputProps }) => (
          <section>
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              <p className='drag-n-drop'>Drag 'n' drop some files here, or click to select files</p>
            </div>
          </section>
        )}
      </Dropzone><br /><br />
      <CreateMessage handleSubmit={handleSubmit} existingMessage={messageToBeEdited?.content} />
      <ToastContainer />
    </div>
  );
};

export default Channel;
