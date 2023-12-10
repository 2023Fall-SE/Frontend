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
    if (storedToken && storedToken.hasOwnProperty("user_id")) {
      setUserToken(storedToken);
    }
    setIsLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      // Make a request to login API endpoint
      const response = await fetch('http://127.0.0.1:8080/login', {
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
        const errorResponse = await response.json(); // Assuming the server returns error details as JSON
        const data = errorResponse.detail;
        console.log(data)
        if(typeof data === 'string'){
          throw new Error(`${response.status}\n${data}`);
        } else if (Array.isArray(data)) {
          const errorLines = data.map(item => `${item.type}: ${item.msg}`)
          throw new Error(`${response.status}\n` + errorLines.join('\n'));
        } else {
          throw new Error(errorResponse.error)
        }
      } else {
        // Parse the response as JSON
        const data = await response.json();
        // Set user info including user_id using setUserToken and save it to cookies
        setIsLoading(true);

        const newUserToken = {
          access_token: data.access_token,
          token_type: data.token_type,
          user_id: data.user_id,
          user_display_name: data.user_display_name
        };
        setUserToken(newUserToken);
        setCookie('userToken', JSON.stringify(newUserToken), {path: '/'});

        setIsLoading(false);
      }
    } catch (error) {
      throw error
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