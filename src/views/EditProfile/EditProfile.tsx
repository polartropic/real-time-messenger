import { useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import AppContext from '../../providers/AppContext';
import { getLiveUserByUsername, updateEmail, updateFirstName, updateLastName, updatePhoneNumber } from '../../services/users.services';
import { updateUserEmail, updateUserPassword } from '../../services/auth.services';
import { MIN_PASSWORD_LENGTH } from '../../common/constants';
import { User } from '../../types/Interfaces';
import { ToastContainer, toast } from 'react-toastify';
import { ImageUpload } from '../../components/UploadFile/UploadFile';
import 'react-toastify/dist/ReactToastify.css';
import './EditProfile.css';
import { deleteUserFile } from '../../services/storage.services';

const EditProfile = (): JSX.Element => {
  const navigate = useNavigate();

  const { appState, setState } = useContext(AppContext);
  const user = appState.userData;

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userData, setUserData] = useState<User>({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    phoneNumber: '',
    imgURL: '',
    status: '',
    teams: [],
    channels: [],
    uid: '',
  });

  useEffect(() => {
    if (appState.userData?.username) {
      const unsubscribe = getLiveUserByUsername(appState.userData.username, (snapshot) => {
        setUserData((snapshot.val()));
      });

      return () => unsubscribe();
    }
  }, [appState.userData?.username]);

  const updateFirstNameFunc = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (user?.firstName === firstName) {
      return toast.warning('This name is already registered in the account!');
    }

    updateFirstName(user!.username, firstName)
      .then(() => {
        setState({
          user: appState.user,
          userData: { ...userData, firstName },
        });

        toast.success('Successful change!');
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  const updateLastNameFunc = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (user?.lastName === lastName) {
      return toast.warning('This name is already registered in the account!');
    }

    updateLastName(user!.username, lastName)
      .then(() => {
        setState({
          user: appState.user,
          userData: { ...userData, lastName },
        });

        toast.success('Successful change!');
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  const updatePhoneFunc = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (user?.phoneNumber === phoneNumber) {
      return toast.warning('This phone number is already registered in the account!');
    }

    updatePhoneNumber(user!.username, phoneNumber)
      .then(() => {
        setState({
          user: appState.user,
          userData: { ...userData, phoneNumber },
        });

        toast.success('Successful change!');
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  const updateEmailFunc = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (user?.email === email) {
      return toast.error('This e-mail is already registered in the account!');
    }

    if (email !== undefined) {
      updateUserEmail(email)
        .then(() => {
          setState({
            user: appState.user,
            userData: { ...userData, email },
          });

          updateEmail(user!.username, email);
          toast.success('Successful change!');
        })
        .catch((error) => {
          if (error.message.includes('already-in-use')) {
            toast.warning('This e-mail is already registered in our system!');
          } else {
            toast.error(error.message);
          }
        });
    }
  };

  const updatePasswordFunc = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password.length < MIN_PASSWORD_LENGTH) {
      return toast.warning('The password is too short! Please use a password of at least 6 characters.');
    }

    updateUserPassword(password)
      .then(() => {
        toast.success('Successful change!');
      })
      .catch(console.error);
  };

  const manageDeleteFile = () => {
    const url = userData.imgURL;
    deleteUserFile(userData.username, url)
      .then(() => toast.success('You deleted you avatar successfully!'));
  };

  return (
    <div className="edit-profile">
      <div className="edit-profile-forms">
        <h3 id="edit-profile-title">Personal details</h3>
        <form className="edit-form" onSubmit={updateFirstNameFunc}>
          <label className="labels-edit" htmlFor="first-name">First Name:</label> <br />
          <input type="text" id="first-name" placeholder="first name" defaultValue={userData.firstName} onChange={(e) => setFirstName(e.target.value)} />
          <input type="submit" className="change-button-edit" value="Change" />
        </form>

        <form className="edit-form" onSubmit={updateLastNameFunc}>
          <label className="labels-edit" htmlFor="last-name">Last name:</label> <br />
          <input type="text" id="last-name" placeholder="last name" defaultValue={userData.lastName} onChange={(e) => setLastName(e.target.value)} />
          <input type="submit" className="change-button-edit" value="Change" />
        </form>

        <form className="edit-form" onSubmit={updatePhoneFunc}>
          <label className="labels-edit" htmlFor="last-name">Phone number:</label> <br />
          <input type="text" id="phone-number" placeholder="phone number" defaultValue={userData.phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
          <input type="submit" className="change-button-edit" value="Change" />
        </form>

        <form className="edit-form" onSubmit={updateEmailFunc}>
          <label className="labels-edit" htmlFor="e-mail">E-mail:</label> <br />
          <input type="email" id="e-mail" placeholder="e-mail" defaultValue={userData.email} onChange={(e) => setEmail(e.target.value)} />
          <input type="submit" className="change-button-edit" value="Change" />
        </form>

        <form className="edit-form" onSubmit={updatePasswordFunc}>
          <label className="labels-edit" htmlFor="new-password">New Password:</label> <br />
          <input type="password" id="new-password" placeholder="new password" onChange={(e) => setPassword(e.target.value)} />
          <input type="submit" className="change-button-edit" value="Change" />
        </form>
        {userData.imgURL ?
          <> <button className='change-button-edit' id='delete-img' onClick={manageDeleteFile}>Delete current avatar</button> <br /></> :
          <ImageUpload />}


        <button className="go-back-btn" onClick={() => navigate('/')}>
          <img src="https://firebasestorage.googleapis.com/v0/b/thunderteam-99849.appspot.com/o/icons8-go-back-48.png.png?alt=media&token=8ce74f60-5dea-4e0f-9260-9102f6b30071" alt='go-back-icon' />
        </button>
      </div>
      <>
        <ToastContainer />
      </>
    </div>
  );
};

export default EditProfile;
