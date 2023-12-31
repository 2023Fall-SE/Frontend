// UserEdit.jsx
import React, {useState} from 'react';
import {Alert, Box, Button, Grid, Snackbar, TextField} from "@mui/material";
import {useAuth} from "../../auth/AuthContext";

const UserEdit = ({userInfo, onCancel, handleSuccess}) => {
  const {isLoading, userToken} = useAuth();
  const [SaveError, setSaveError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [editedUserInfo, setEditedUserInfo] = useState({
    display_name: userInfo?.display_name,
    mail: userInfo?.mail,
    phone: userInfo?.phone,
  });

  const isFormValid = () => {
    // Check if ANY field is not empty
    const isAnyFieldNotEmpty = Object.values(editedUserInfo).some(value => value.trim() !== '');

    // Specific validation conditions for each field
    const isDisplayNameValid = !editedUserInfo.display_name.trim() || editedUserInfo.display_name.trim().length >= 3;
    const isPhoneValid = !editedUserInfo.phone || editedUserInfo.phone.trim().length >= 10;
    const isEmailValid = !editedUserInfo.mail || /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$/.test(editedUserInfo.mail);
    
    // Check if at least one condition is met
    return isAnyFieldNotEmpty || isDisplayNameValid || isPhoneValid || isEmailValid;
  };
  const handleSaveClick = async () => {
    if (isFormValid()) {
      try {
        const userID = userToken.user_id;
        const url = "http://127.0.0.1:8080";
        const updateUserInfo = url+"/update-user-info"
        const response = await fetch(updateUserInfo, {
          method: 'put',
          withCredentials: true,
          credentials: 'include',
          headers: new Headers({
            'Authorization': `Bearer ${userToken.access_token}`,
            'Content-Type': 'application/json'
          }),
          body: JSON.stringify({
            user_id: userID,
            display_name: editedUserInfo.display_name,
            phone: editedUserInfo.phone,
            mail: editedUserInfo.mail,
          }),
        });

        if (response.ok) {
          // Handle successful response
          handleSuccess();
          // After saving, exit edit mode
          onCancel();
          // ...
        } else {
          // Handle error response
          const errorData = await response.json();
          console.error('API error:', errorData);
          setSaveError(true);
          const errMessage = Array.isArray(errorData.detail) ? errorData.detail[0].msg : errorData.detail;
          setErrorMessage('API error:' + errMessage);
        }
      } catch (error) {
        console.error('Error updating user information:', error);
        setSaveError(true);
        setErrorMessage('Error updating user information:' + error.message);
      }


    } else {
      // Display an error message or handle the case where the form is not valid
      console.error('Invalid form data');
      setSaveError(true);
      setErrorMessage('Invalid form data');
    }
  };

  const handleCancelClick = () => {
    // Exit edit mode without saving
    onCancel();
  };

  const handleInputChange = (e) => {
    const {name, value} = e.target;
    setEditedUserInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setSaveError(false);
  };

  return (
    <Box>
      <Snackbar
        open={SaveError}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert elevation={6} variant="filled" severity="error">
          Save Error! {errorMessage}
        </Alert>
      </Snackbar>
      <TextField
        label="Display Name"
        variant="outlined"
        fullWidth
        margin="normal"
        name="display_name"
        value={editedUserInfo.display_name}
        onChange={handleInputChange}
        required
      />
      <TextField
        label="Email"
        variant="outlined"
        fullWidth
        margin="normal"
        name="mail"
        value={editedUserInfo.mail}
        onChange={handleInputChange}
      />
      <TextField
        label="Phone"
        variant="outlined"
        fullWidth
        margin="normal"
        name="phone"
        value={editedUserInfo.phone}
        onChange={handleInputChange}
      />
      <Box mt={2}>
        <Grid container spacing={2}>
          <Grid item>
            <Button variant="contained" onClick={handleSaveClick}>
              儲存
            </Button>
          </Grid>
          <Grid item>
            <Button variant="contained" onClick={handleCancelClick}>
              取消
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default UserEdit;
