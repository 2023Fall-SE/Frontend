import React, { useEffect, useState } from "react";
import {Box, Button, Container, Divider, Grid, Paper, Typography} from "@mui/material";
import {useAuth} from "../../auth/AuthContext";

export const TopUp = () => {
	const { userToken } = useAuth();
	const [carpoolMoney, setCarpoolMoney] = useState(0);

	const fetchBalance = async () => {
		try {
			const userID = userToken==null?null:userToken.user_id;
			const searchBalance=`http://127.0.0.1:8000/payment/${userID}`;
			const response = await fetch(searchBalance);
			const data = await response.json();

			if (data.result !== "None" && Object.keys(data).length > 0) {
				console.log(data);
				setCarpoolMoney(data.account);
				return data.user_id;
			} else {
				return 0;
			}
		} catch (error) {
			console.error('Error fetching event information:', error);
			// Handle error here, set joinedEvents to empty or show a message
			setCarpoolMoney("尚未登入")
			return -1;
		}
	}
	
	useEffect(() => {
		fetchBalance();
		setCarpoolMoney(carpoolMoney);
	}, []);

	return (
		<Container style={{ marginTop: 20 }}>
			<Paper elevation={3} style={{ padding: 20, height: "calc(95vh - 64px)" }}>
				<Typography variant="h4" style={{ marginBottom: 20 }}>
					儲值Carpool-Money
				</Typography>
				<Divider />
				<Box mt={3} sx={{ marginLeft: 2 }}>
					<Grid container>
						<Grid item>
							<Typography variant="h5">我的Carpool-Money: {carpoolMoney}</Typography>
						</Grid>
					</Grid>
				</Box>
				<Button>
					
				</Button>
			</Paper>
		</Container>
	);
};

export default TopUp;
