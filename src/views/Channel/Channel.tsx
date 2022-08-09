import Message from '../Message/Message';
import './Channel.css';
import { ChannelProps } from '../../types/Interfaces';

const Channel = ({ currentChannel }: ChannelProps) => {
  return (
    <div className="channel-container">
      <h4>Channel's title: {currentChannel.title}</h4>
      <hr />

      <p>Messages go here</p>
      <Message />

      <div className="message-box">
        <button className="emoji-btn"><i className="fa-regular fa-face-smile"></i></button>
        <textarea className="message-textarea" placeholder="Write a message here..."></textarea>
        <button className="send-btn"><i className="fa-solid fa-paper-plane"></i></button>
      </div>
    </div>
  );
};

export default Channel;
