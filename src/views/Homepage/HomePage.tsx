import './HomePage.css';
import { Link } from 'react-router-dom';
import { useContext, useState } from 'react';
import { createUserByUsername, getUserByUsername } from '../../services/users.services';
import { createUser } from '../../services/auth.services';
import React from 'react';
import AppContext from '../../providers/AppContext';

const HomePage = (): JSX.Element => {
  const [regDetails, setRegDetails] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  });

  const { appState } = useContext(AppContext);
  console.log(appState);

  const updateForm = (prop: string) => (e: React.FormEvent<HTMLInputElement>) => {
    setRegDetails({
      ...regDetails,
      [prop]: e.currentTarget.value,
    });
  };

  const register: React.FormEventHandler<HTMLFormElement> = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (regDetails.password !== regDetails.confirmPassword) {
      return alert('Passwords do not match!');
    }

    getUserByUsername(regDetails.username)
      .then((snapshot) => {
        if (snapshot.exists()) {
          return alert(`The username ${regDetails.username} already exists!`);
        }

        return createUser(regDetails.email, regDetails.password)
          .then((u) => {
            createUserByUsername(regDetails.firstName, regDetails.lastName,
              regDetails.phoneNumber, regDetails.username, u.user.email, u.user.uid)
              .then(() => {
                alert('Successful sign up!');
              })
              .catch(console.error);
          })
          .catch((event) => {
            if (event.message.includes('email-already-in-use')) {
              alert(`The e-mail ${regDetails.email} is already in use!`);
            } else if (event.message.includes('invalid-email')) {
              alert(`The e-mail ${regDetails.email} is invalid`);
            } else if (event.message.includes('weak-password')) {
              alert('The password is too week! Please use a password with at least 6 characters.');
            } else {
              alert(event.message);
            }
          },
          );
      })
      .catch(console.error);
  };

  return (
    // Unregistered user part
    <div id='home-page'>

      <div id='register-div'>
        <form id="register-form" onSubmit={register}>
          <h4 id="sign-up">Sign up</h4>
          <label htmlFor="first-name">First Name:</label>
          <br />
          <input type="text"className="register-field" name="first-name" placeholder="first name" required value={regDetails.firstName} onChange={updateForm('firstName')}/>
          <br />
          <br />
          <label htmlFor="last-name">Last Name:</label>
          <br />
          <input type="text"className="register-field" name="last-name" placeholder="last name" required value={regDetails.lastName} onChange={updateForm('lastName')}/>
          <br />
          <br />
          <label htmlFor="phone-number">Phone number:</label>
          <br />
          <input type="tel" className="register-field" name="phone-number" placeholder="phone number" required value={regDetails.phoneNumber} onChange={updateForm('phoneNumber')} />
          <br />
          <br />
          <label htmlFor="username">Username:</label>
          <br />
          <input type="text" className="register-field" name="username" placeholder="username" required value={regDetails.username} onChange={updateForm('username')}/>
          <br />
          <br />
          <label htmlFor="email">E-mail:</label>
          <br />
          <input type="email" className="register-field" name="email" placeholder="e-mail" required value={regDetails.email} onChange={updateForm('email')}/>
          <br />
          <br />
          <label htmlFor="password">Password:</label>
          <br />
          <input type="password" className="register-field" name="password" placeholder="password" required value={regDetails.password} onChange={updateForm('password')}/>
          <br />
          <br />
          <label htmlFor="confirm-password">Confirm Password:</label>
          <br />
          <input type="password" className="register-field" name="confirm-password" placeholder="confirm-password" required value={regDetails.confirmPassword} onChange={updateForm('confirmPassword')} />
          <br />
          <h3>Already have an account?
            <Link to={'/login'}>
              <button id="sign-in-btn">Sign in</button>
            </Link>
          </h3>
          <button id="sign-up-btn">Sign up</button>
        </form>
      </div>
    </div>
  );
};

export default HomePage;
