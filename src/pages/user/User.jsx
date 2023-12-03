// User.jsx
import React, {useEffect, useState} from 'react';
import {Box, Button, Card, CardMedia, Container, Divider, Grid, Paper, TextField, Typography} from "@mui/material";
import { useNavigate } from 'react-router-dom';
import {Snackbar, Alert} from "@mui/material";
import UserEdit from './UserEdit';
import ChangePassword from './ChangePassword';
import { useAuth } from "../../auth/AuthContext";

export const User = () => {
	const { userToken } = useAuth();
	const navigate = useNavigate();
	const [userInfo, setUserInfo] = useState({
		display_name: "",
		mail: "",
		phone: "",
	});
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
		
		if(userToken == null)
			navigate('/Login');
		
		// real API call
		const fetchUserInfo = async () => {
			try {
				// Perform API call to get user info
				const userID = userToken.user_id;
				const getUserInfo = `http://127.0.0.1:8000/get-user-info/${userID}`;
				const response = await fetch(getUserInfo);
				console.log('fetch userInfo.');

				return response.json();
			} catch (error) {
				console.error('Error fetching user information:', error);
				return null;
			}
		};
		fetchUserInfo().then(userData => {
			if(userData !== null && Object.keys(userData).length > 0) {
				setUserInfo(userData);
			} else {
				setUserInfo(pseudoUserData);
			}
		});
	}, []);

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

	const handleVerifyLicenseClick = () => {
		// Navigate to /verifyLicense or show the verification module
		// This part will be implemented once the decision is made
	};
	return (
		<Container style={{ marginTop: 20 }}>
			<Paper elevation={3} style={{ padding: 20 }}>
				<Typography variant="h4" style={{ marginBottom: 20 }}>
					用戶資料
				</Typography>
				<Divider />
				<Box>
					{!isEditing && !isChangingPassword && (
						<>
							<Grid item style={{ marginTop: 10 }} xs={12} lg={6}>
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
										<Button variant="contained" onClick={handleEditClick} >
											編輯
										</Button>
									</Grid>
									<Grid item>
										<Button variant="contained" onClick={handleChangePasswordClick} >
											更改密碼
										</Button>
									</Grid>
								</Grid>
							</Box>
						</>
					)}
					{isEditing && (
						<UserEdit userInfo={userInfo} onCancel={handleCancelClick} handleSuccess={handleChildSuccess} />
					)}
					{isChangingPassword && (
						<ChangePassword onCancel={handleCancelClick} handleSuccess={handleChildSuccess} />
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
							<Card style={{ width: '100%', height: '300px' }}>
								<CardMedia
									component="img"
									alt="Driver License"
									image={require('./License1.png')}
									style={{ width: '100%', height: '100%', objectFit: 'contain' }}
								/>
							</Card>
						</Grid>
						<Grid item xs={6} container  alignItems="flex-end">
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
