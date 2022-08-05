import './EditProfile.css';
import DefaultAvatar from '../../assets/images/Default-avatar.jpg';
import { useNavigate } from 'react-router-dom';

const EditProfile = (): JSX.Element => {
  const navigate = useNavigate();

  return (
    <div className="edit-profile">
      <div className="edit-profile-forms">
        <h3 id="edit-profile-title">Personal details</h3>
        <img className="default-avatar" src={DefaultAvatar} alt="default-avatar" />
        <form className="edit-form">
          <label className="labels-edit" htmlFor="first-name">First Name:</label> <br />
          <input type="text" id="first-name" placeholder="first name"/>
          <input type="submit" className="change-button-edit" value="Change" />
        </form>
        <br />
        <form className="edit-form">
          <label className="labels-edit" htmlFor="last-name">Last name: </label> <br />
          <input type="text" id="last-name" placeholder="last name"/>
          <input type="submit" className="change-button-edit" value="Change" />
        </form>
        <br />
        <form className="edit-form">
          <label className="labels-edit" htmlFor="last-name">Phone number: </label> <br />
          <input type="text" id="last-name" placeholder="phone number" />
          <input type="submit" className="change-button-edit" value="Change" />
        </form>
        <br />
        <form className="edit-form">
          <label className="labels-edit" htmlFor="e-mail">E-mail: </label> <br />
          <input type="email" id="e-mail" placeholder="e-mail" />
          <input type="submit" className="change-button-edit" value="Change" />
        </form>
        <br />
        <form className="edit-form">
          <label className="labels-edit" htmlFor="new-password">New Password:</label> <br />
          <input type="password" id="new-password" placeholder="new password" />
          <input type="submit" className="change-button-edit" value="Change" />
        </form>
        <br />
        <button id="go-back-btn-edit" onClick={() => navigate('/')}>Go back</button>
      </div>

    </div>
  );
};

export default EditProfile;
