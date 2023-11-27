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
import { Temp } from './pages/carpool/Temp';
import { CookiesProvider, useCookies } from "react-cookie";



const router = createBrowserRouter([
  { path: '/', element: <RootLayout />, children: [
    { path: '/search', element: <CarpoolSearch /> },
    { path: '/launch', element: <CarpoolLaunch /> },
    { path: '/joined', element: <CarpoolJoined /> },
    { path: '/ended', element: <CarpoolEnded /> },
    { path: '/temp', element: <Temp />},
  ] },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={ router } />
  </React.StrictMode>
);
