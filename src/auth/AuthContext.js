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

  const [userInfo, setUserInfo] = useState({
    display_name: "",
    mail: "",
    phone: "",
  });
  
  const login = async (username, password) => {
    try {
      var newUserToken = {};
      // Make a request to login API endpoint
      const response = await fetch('https://carpool-service-test-cvklf2agbq-de.a.run.app/login', {
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

        
        newUserToken = {
          access_token: data.access_token,
          token_type: data.token_type,
          user_id: data.user_id,
          user_display_name : ""
        };
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

        try {
          // Perform API call to get user info
          const userID = data.user_id;
          console.log(userID);
          
          const url = "https://carpool-service-test-cvklf2agbq-de.a.run.app/";
          const getUserInfo = url+`/get-user-info/${userID}`;
          const response = await fetch(getUserInfo, {
            method: 'get',
            withCredentials: true,
            credentials: 'include',
            headers: new Headers({
              'Authorization': `Bearer ${data.access_token}`,
              'Content-Type': 'application/json'
            })
          });
          console.log('fetch userInfo.');
          console.log(data.access_token);
          
          
          const pseudoUserData = {
            display_name: "no userData",
            mail: "no userData",
            phone: "no userData",
          };
          
          const name_data = await response.json();
          
          if (name_data !== null && Object.keys(name_data).length > 0) {
            newUserToken = {
              access_token: data.access_token,
              token_type: data.token_type,
              user_id: data.user_id,
              user_display_name : name_data.display_name
            };
            setUserInfo(name_data);
  
          } else {
            setUserInfo(pseudoUserData);
          }
        } catch (error) {
          console.error('Error fetching user information:', error);
          return null;
        }
          
        

        setIsLoading(true);
        setUserToken(newUserToken);
        setCookie('userToken', JSON.stringify(newUserToken), {path: '/'});
        
        setIsLoading(false);
       
      }
    }catch (error) {
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