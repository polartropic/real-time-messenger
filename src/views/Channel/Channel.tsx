import './Channel.css';

const Channel = () => {
  return (
    <div className="channel-container">
      <h4>Channel's title goes here.</h4>
      <hr />

      <div>
        <p>Messages go here</p>
      </div>

      <div className="message-box">
        <button className="emoji-btn"><i className="fa-regular fa-face-smile"></i></button>
        <textarea className="message-textarea" placeholder="Write a message here..."></textarea>
        <button className="send-btn"><i className="fa-solid fa-paper-plane"></i></button>
      </div>
    </div>
  );
};

export default Channel;
