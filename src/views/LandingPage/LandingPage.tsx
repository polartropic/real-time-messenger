import './LandingPage.css';

const LandingPage = (): JSX.Element => {
  return (
    <div id="landing-page">
      <div id="chats-channels-list">
        <h4>Chats:</h4>
        <p>User1</p>
        <p>User2</p>
        <p>User3</p>
        <p>User4</p>
      </div>

      <div id="main-container">
        <div id="view-and-search-users">
          <button>View all users</button>
          <input type="text" defaultValue="search users..." />
        </div>

        <hr />

        <h4>Click around to see your chats, teams or channels show up here.</h4>
      </div>

      <div id="participants-list">
        <h4>Owner:</h4>
        <p>User0</p>

        <h4>Participants of chat/team:</h4>
        <p>User1</p>
        <p>User2</p>
        <p>User3</p>
        <p>User4</p>

        <button>Add more participants</button>
        <br />
        <button>Leave chat/channel</button>
      </div>
    </div>
  );
};

export default LandingPage;
