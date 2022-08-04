import './Login.css';
import { Link } from 'react-router-dom';

const Login = (): JSX.Element => {
  return (
    <div id="login-div">
      <form id="login-form">
        <h4 id="sign-in">Sign in</h4>
        <label htmlFor="username">Username:</label>
        <br />
        <input type="text" id="username" placeholder='username' value="" />
        <br /><br />
        <label htmlFor="password">Password:</label>
        <br />
        <input type="password" id="password" placeholder='password' defaultValue="" />
        <br /><br />
        <button id="sign-in-button" className='user-btn'>Sign in</button>
        <br />
        <h3>Don't have an account yet?
          <Link to={'/home-page'}>
            <button id="go-back-register-btn">Go back to register</button>
          </Link>
        </h3>
        <br />
      </form>
    </div>
  );
};

export default Login;
