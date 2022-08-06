import CreateTeam from '../Create-a-team/CreateTeam';
import Channel from '../Channel/Channel';
import './LoggedUser.css';

const LoggedUser = (): JSX.Element => {
  return (
    <div className="landing-page">
      <div className="chats-channels-list">
        <div className="search-users">
          <input type="text" defaultValue="search users..." />
          <button className="view-users-btn">View all users</button>
        </div>

        <h4>Chats:</h4>
        <p>User1</p>
        <p>User2</p>
        <p>User3</p>
        <p>User4</p>
      </div>

      {/* DYNAMIC DIV TO SHOW RESULTS FROM SEARCH AND VIEWING CHATS */}
      <div className="main-container">
        <button>View all users</button>

        <div className="search-users">
          <input type="text" defaultValue="search users..." />
        </div>

        <hr />

        {/* DYNAMIC DIV TO SHOW RESULTS FROM SEARCH AND VIEWING CHATS */}
        <div className="content">
          <h4>Click around to see your chats, teams or channels show up here.</h4>
          <CreateTeam/>
        </div>
        <Channel />
      </div>

      <div className="participants-list">
        <h4>Owner:</h4>
        <p>User0</p>

        <h4>Participants of chat/team:</h4>
        <p>User1</p>
        <p>User2</p>
        <p>User3</p>
        <p>User4</p>

        <div className="manage-participants-btns">
          <button className="add-btn"><span>Add members</span></button>
          <br />
          <button className="leave-btn">Leave channel</button>
        </div>
      </div>
    </div>
  );
};

export default LoggedUser;
