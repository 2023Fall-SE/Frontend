import React, { useEffect, useState } from "react";
import {Box, Button, Container, Divider, Grid, Paper, Typography} from "@mui/material";

export const TopUp = () => {
	const [carpoolMoney, setCarpoolMoney] = useState(0);

	useEffect(() => {
		setCarpoolMoney(100);
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
