// AuthContext.js
import React, {createContext, useContext, useEffect, useState} from 'react';
import {useCookies} from 'react-cookie';

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  const [userToken, setUserToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [cookies, setCookie, removeCookie] = useCookies(['userToken']);

  // Check for the presence of the user token in cookies on mount
  useEffect(() => {
    const storedToken = cookies.userToken;
    console.log(storedToken);
    if (storedToken) {
      setUserToken(storedToken);
    }
    setIsLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      // Make a request to login API endpoint
      const response = await fetch('http://127.0.0.1:8000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: '',
          username,
          password,
          scope: '',
          client_id: '',
          client_secret: '',
        }),
      });

      // Check if the request was successful
      if (!response.ok) {
        // Handle unsuccessful login (e.g., show an error message)
        console.error('Login failed:', response.statusText);
        return;
      }

      // Parse the response as JSON
      const data = await response.json();

      // Set user info including user_id using setUserToken and save it to cookies
      const newUserToken = {
        token: data.Token,
        user_id: data.user_id,
      };
      setUserToken(newUserToken);
      setCookie('userToken', JSON.stringify(newUserToken), {path: '/'});
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  const logout = () => {
    // Implement logout logic and clear user info from cookies
    setUserToken(null);
    removeCookie('userToken', {path: '/'});
  };

  return (
    <AuthContext.Provider value={{userToken, login, logout}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};