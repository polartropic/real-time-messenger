import './EditProfile.css';
import DefaultAvatar from '../../assets/images/Default-avatar.jpg';
import { useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import AppContext from '../../providers/AppContext';
import { updateEmail, updateFirstName, updateLastName, updatePhoneNumber } from '../../services/users.services';
import { updateUserEmail, updateUserPassword } from '../../services/auth.services';
import { MIN_PASSWORD_LENGTH } from '../../common/constants';


const EditProfile = (): JSX.Element => {
  const navigate = useNavigate();
  const { appState} = useContext(AppContext);
  const user = appState.userData;

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const updateFirstNameFunc = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (user?.firstName === firstName) {
      return alert('This name is already registered in the account!');
    }

    updateFirstName(user!.username, firstName)
      .then(() => {
        alert('Successful change!');
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  const updateLastNameFunc = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (user?.lastName === lastName) {
      return alert('This name is already registered in the account!');
    }

    updateLastName(user!.username, lastName)
      .then(() => {
        alert('Successful change!');
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  const updatePhoneFunc = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (user?.phoneNumber === phoneNumber) {
      return alert('This phone is already registered in the account!');
    }

    updatePhoneNumber(user!.username, phoneNumber)
      .then(() => {
        alert('Successful change!');
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  const updateEmailFunc = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (user?.email === email) {
      return alert('This e-mail is already registered in the account!');
    }

    if (email!==undefined) {
      updateUserEmail(email)
        .then(() => {
          updateEmail(user!.username, email);
          alert('Successful change!');
        })
        .catch((error) => {
          if (error.message.includes('already-in-use')) {
            alert('This e-mail is already registered in our system!');
          } else {
            alert(error.message);
          }
        });
    }
  };

  const updatePasswordFunc = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password.length < MIN_PASSWORD_LENGTH) {
      return alert('The password is too short! Please use a password of at least 6 characters.');
    }

    updateUserPassword(password)
      .then(() => {
        alert('Successful change!');
      });
  };

  return (
    <div className="edit-profile">
      <div className="edit-profile-forms">
        <h3 id="edit-profile-title">Personal details</h3>
        <img className="default-avatar" src={DefaultAvatar} alt="default-avatar" />
        <form className="edit-form" onSubmit={updateFirstNameFunc}>
          <label className="labels-edit" htmlFor="first-name">First Name:<br />  {user?.firstName}</label> <br />
          <input type="text" id="first-name" placeholder="first name" onChange={(e) => setFirstName(e.target.value)}/>
          <input type="submit" className="change-button-edit" value="Change" />
        </form>
        <br />
        <form className="edit-form" onSubmit={updateLastNameFunc}>
          <label className="labels-edit" htmlFor="last-name">Last name: <br /> {user?.lastName}</label> <br />
          <input type="text" id="last-name" placeholder="last name" onChange={(e) => setLastName(e.target.value)}/>
          <input type="submit" className="change-button-edit" value="Change" />
        </form>
        <br />
        <form className="edit-form" onSubmit={updatePhoneFunc}>
          <label className="labels-edit" htmlFor="last-name">Phone number: <br /> {user?.phoneNumber} </label> <br />
          <input type="text" id="last-name" placeholder="phone number" onChange={(e) => setPhoneNumber(e.target.value)} />
          <input type="submit" className="change-button-edit" value="Change" />
        </form>
        <br />
        <form className="edit-form" onSubmit={updateEmailFunc}>
          <label className="labels-edit" htmlFor="e-mail">E-mail: <br />  {user?.email}</label> <br />
          <input type="email" id="e-mail" placeholder="e-mail" onChange={(e) => setEmail(e.target.value)} />
          <input type="submit" className="change-button-edit" value="Change" />
        </form>
        <br />
        <form className="edit-form" onSubmit={updatePasswordFunc}>
          <label className="labels-edit" htmlFor="new-password">New Password:</label> <br />
          <input type="password" id="new-password" placeholder="new password" onChange={(e) => setPassword(e.target.value)}/>
          <input type="submit" className="change-button-edit" value="Change" />
        </form>
        <br />
        <button id="go-back-btn-edit" onClick={() => navigate('/')}>Go back</button>
      </div>

    </div>
  );
};

export default EditProfile;
