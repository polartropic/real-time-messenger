import './HomePage.css';

const HomePage = (): JSX.Element => {
  return (
    // Unregistered user part
    <div id='home-page'>

      <div id='register-div'>
        <form id="register-form">
          <h4 id="sign-up">Sign up</h4>
          <label htmlFor="first-name">First Name:</label>
          <br />
          <input type="text"className="register-field" name="first-name" placeholder="first name" required value='' />
          <br />
          <br />
          <label htmlFor="last-name">Last Name:</label>
          <br />
          <input type="text"className="register-field" name="last-name" placeholder="last name" required value='' />
          <br />
          <br />
          <label htmlFor="phone-number">Phone number:</label>
          <br />
          <input type="tel" className="register-field" name="phone-number" placeholder="phone number" required value='' />
          <br />
          <br />
          <label htmlFor="username">Username:</label>
          <br />
          <input type="text" className="register-field" name="username" placeholder="username" required value='' />
          <br />
          <br />
          <label htmlFor="email">E-mail:</label>
          <br />
          <input type="email" className="register-field" name="email" placeholder="e-mail" required value='' />
          <br />
          <br />
          <label htmlFor="password">Password:</label>
          <br />
          <input type="password" className="register-field" name="password" placeholder="password" required value='' />
          <br />
          <br />
          <label htmlFor="confirm-password">Confirm Password:</label>
          <br />
          <input type="password" className="register-field" name="confirm-password" placeholder="confirm-password" required value='' />
          <br />
          <br />
          <h3>Already have an account?
            <button id="sign-in-btn">Sign in</button>
          </h3>
          <button id="sign-up-btn">Sign up</button>
        </form>
      </div>
    </div>
  );
};

export default HomePage;
