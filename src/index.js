import 'bootstrap/dist/css/bootstrap.min.css';
// UseEffect , Router : Loader,Action
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter, Route, Router } from 'react-router-dom';
import { RootLayout } from './layouts/RootLayout';
import { CarpoolSearch } from './pages/carpool/CarpoolSearch';
import { CarpoolLaunch } from './pages/carpool/CarpoolLaunch';
import { CarpoolJoined } from './pages/carpool/CarpoolJoined';
import { CarpoolEnded } from './pages/carpool/CarpoolEnded';
import { Carpooljoinevent} from './pages/carpool/CarpoolJoinEvent';
import {CarpoolLogin } from './pages/carpool/CarpoolLogin';

import { CookiesProvider, useCookies } from "react-cookie";





const router = createBrowserRouter([

  { path: '/loginstate', element: <RootLayout />, children: [
    { path: '/loginstate/search', element: <CarpoolSearch /> },
    { path: '/loginstate/launch', element: <CarpoolLaunch /> },
    { path: '/loginstate/joined', element: <CarpoolJoined /> },
    { path: '/loginstate/ended', element: <CarpoolEnded /> },
    { path : '/loginstate/:id',element: < Carpooljoinevent/>},
    { path: '/loginstate/Login',element : <CarpoolLogin/>}
  ] },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  
  <React.StrictMode>
    <RouterProvider router={ router } />
  </React.StrictMode>
);
