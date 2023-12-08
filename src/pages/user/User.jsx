// User.jsx
import React, {useEffect, useState} from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardMedia,
  Container,
  Divider,
  Grid,
  Paper,
  Snackbar,
  TextField,
  Typography
} from "@mui/material";
import {useNavigate} from 'react-router-dom';
import UserEdit from './UserEdit';
import ChangePassword from './ChangePassword';
import {useAuth} from "../../auth/AuthContext";

import { pusher, beamsClient } from "../../pusher_util";

export const User = () => {
  const {isLoading, userToken, logout} = useAuth();
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({
    display_name: "",
    mail: "",
    phone: "",
  });
  const [img, setImg] = useState();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isEditSuccess, setIsEditSuccess] = useState(false);

  useEffect(() => {
    // Simulating API call to fetch user info
    // Replace the following with your actual API call
    const pseudoUserData = {
      display_name: "no userData",
      mail: "no userData",
      phone: "no userData",
    };

    // real API call
    const fetchUserInfo = async () => {
      if (!isLoading && userToken) {
        console.log()
        try {
          // Perform API call to get user info
          const userID = userToken.user_id;
          const url = "https://carpool-service-test-cvklf2agbq-de.a.run.app";
          const getUserInfo = url+`/get-user-info/${userID}`;
          const response = await fetch(getUserInfo, {
            method: 'get',
            withCredentials: true,
            credentials: 'include',
            headers: new Headers({
              'Authorization': `Bearer ${userToken.access_token}`,
              'Content-Type': 'application/json'
            })
          });
          console.log('fetch userInfo.');

          const data = await response.json();
          if (data !== null && Object.keys(data).length > 0) {
            setUserInfo(data);
          } else {
            setUserInfo(pseudoUserData);
          }
        } catch (error) {
          console.error('Error fetching user information:', error);
          return null;
        }
      }
    };

    const fetchUserLicense = async () => {
      if (!isLoading && userToken) {
        try {
          const userID = userToken.user_id;
          const url = "https://carpool-service-test-cvklf2agbq-de.a.run.app";
          const getUserImg = url+`/get-user-license/${userID}`;
          const res = await fetch(getUserImg, {
            method: 'get',
            withCredentials: true,
            credentials: 'include',
            headers: new Headers({
              'Authorization': `Bearer ${userToken.access_token}`,
              'Content-Type': 'application/x-www-form-urlencoded'
            })
          });
          const imageBlob = await res.blob();
          const imageObjectURL = URL.createObjectURL(imageBlob);
          setImg(imageObjectURL);
          console.log('fetch userImg.');
        } catch (error) {
          console.error('Error fetching user driver license:', error);
          return null;
        }
      }
    }

    if (!isLoading && userToken) {
      fetchUserInfo();
      fetchUserLicense();
    }
    if (!isLoading && userToken == null)
      navigate('/Login');

  }, [isLoading, userToken]);

  const handleChildSuccess = () => {
    // Do something with the data received from the child
    setIsEditSuccess(true);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setIsEditSuccess(false);
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setIsEditSuccess(false);
    setIsChangingPassword(false);
  };

  const handleChangePasswordClick = () => {
    setIsChangingPassword(true);
    setIsEditSuccess(false);
    setIsEditing(false);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setIsChangingPassword(false);
  };

  const handleLogoutClick = () => {
    logout();

    //clear and stop the pusher
    beamsClient.clearAllState()
    .then(() => console.log('Beams state has been cleared'))
    .catch(e => console.error('Could not clear Beams state', e));

    beamsClient.stop()
    .then(() => console.log('Beams has been stoped'))
    .catch(console.error);
  }

  const handleVerifyLicenseClick = () => {
    navigate('/upload');
  };
  return (
    <Container style={{marginTop: 20}}>
      <Paper elevation={3} style={{padding: 20}}>
        <Typography variant="h4" style={{marginBottom: 20}}>
          用戶資料
        </Typography>
        <hr />

        <Box>
          {!isEditing && !isChangingPassword && (
            <>
              <Grid item style={{marginTop: 10}} xs={12} lg={6}>
                <Grid item xs={12}>
                  <TextField
                    label="Display Name"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    disabled
                    value={userInfo?.display_name}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Email"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    disabled
                    value={userInfo?.mail}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Phone"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    disabled
                    value={userInfo?.phone}
                  />
                </Grid>
              </Grid>
              <Box mt={2}>
                <Grid container spacing={2}>
                  <Grid item>
                    <Button variant="contained" onClick={handleEditClick}>
                      編輯
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button variant="contained" onClick={handleChangePasswordClick}>
                      更改密碼
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button variant="contained" onClick={handleLogoutClick}>
                      登出
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </>
          )}
          {isEditing && (
            <UserEdit userInfo={userInfo} onCancel={handleCancelClick} handleSuccess={handleChildSuccess}/>
          )}
          {isChangingPassword && (
            <ChangePassword onCancel={handleCancelClick} handleSuccess={handleChildSuccess}/>
          )}
          {/* save success message */}
          <Snackbar
            open={isEditSuccess}
            autoHideDuration={6000}
            onClose={handleSnackbarClose}
          >
            <Alert elevation={6} variant="filled" onClose={handleSnackbarClose} severity="success">
              Save Success!
            </Alert>
          </Snackbar>
        </Box>

        <Box mt={4}>
          <Typography variant="h5">
            駕照驗證
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Card style={{width: '100%', height: '300px'}}>
                <CardMedia
                  component="img"
                  alt="Driver License"
                  src={img} // image={require('./License1.png')}
                  style={{width: '100%', height: '100%', objectFit: 'contain'}}
                  onError={(e) => {
                    // Handle the error here
                    e.target.src = require('./noLicense.png'); // Provide a fallback image path
                    // Alternatively, you can set a default image URL or show a placeholder message
                    // e.target.src = 'default-image-url.jpg';
                    // e.target.alt = 'Image not found';
                  }}
                />
              </Card>
            </Grid>
            <Grid item xs={6} container alignItems="flex-end">
              <Button variant="contained" onClick={handleVerifyLicenseClick}>
                駕照驗證
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default User;
