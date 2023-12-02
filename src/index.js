import 'bootstrap/dist/css/bootstrap.min.css';
// UseEffect , Router : Loader,Action
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { RootLayout } from './layouts/RootLayout';
import { CarpoolSearch } from './pages/carpool/CarpoolSearch';
import { CarpoolLaunch } from './pages/carpool/CarpoolLaunch';
import { CarpoolJoined } from './pages/carpool/CarpoolJoined';
import { CarpoolEnded } from './pages/carpool/CarpoolEnded';
import { User } from './pages/user/User'
import { TopUp } from './pages/wallet/TopUp'
import { Temp } from './pages/carpool/Temp';
import { CookiesProvider, useCookies } from "react-cookie";
import { AuthProvider } from "./auth/AuthContext";



const router = createBrowserRouter([
  { path: '/', element: <RootLayout />, children: [
    { path: '/search', element: <CarpoolSearch /> },
    { path: '/launch', element: <CarpoolLaunch /> },
    { path: '/joined', element: <CarpoolJoined /> },
    { path: '/ended', element: <CarpoolEnded /> },
    { path: '/user', element: <User /> },
    { path: '/top-up', element: <TopUp />},
    { path: '/temp', element: <Temp />},
  ] },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* AuthProvider: 
    1. inside AuthContext.js, the login function shall save userInfo inside AuthContext component
       ... // call either api/log or api/token-check to get userID from backend
       ... setUserInfo({ userID: userID})
    2. inside other component 
       ... import { useAuth } from './AuthContext';
       ... // inside component main
       ... const { userInfo, login, logout } = useAuth();
       ... // inside useEffect()
       ... ... userID = userInfo.userID;
     */}
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
