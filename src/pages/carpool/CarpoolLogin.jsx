
import React, { useState } from 'react';
import { useNavigate ,Link} from 'react-router-dom';

export const CarpoolLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    // Add your login logic here (e.g., API call for authentication)

    // For simplicity, always consider it a successful login for now
    // In a real application, you'd want to validate the user's credentials
    // and handle the login process accordingly.

    // Redirect to the '/loginstate/search' page after successful login
    navigate('/loginstate/Login');
  };

  return (
    <div>
      <h2>Welcome to Carpol Service System</h2>
      <br />
      <label>
        E-mail:
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
      </label>
      <br />
      <br />
      <label>
        Password:
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </label>
      <br />
      <button onClick={handleLogin}>Sign in</button>
      <p>If you are not a member,please {' '}
        <a href="/loginstate/ended" target="_blank" rel="noopener noreferrer">
          REGISTER HERE
        </a>
      </p>
    </div>
  );
};

export default CarpoolLogin;