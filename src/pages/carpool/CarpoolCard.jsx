import React from 'react';
import {
	Card,
	CardContent,
	Typography,
	Divider,
	Box,
	Button,
	Grid,
} from '@mui/material';

const CarpoolCard = ({ item, cardType }) => {
	const renderActionButton = () => {
		switch (cardType) {
			case 'Active':
				return (
					<Box p={2}>
						<Button variant="contained" color="primary">
							加入共乘
						</Button>
					</Box>
				);
			case 'Initiator':
				return (
					<Box p={2}>
						<Button variant="contained" color="primary">
							共乘聊天室
						</Button>
					</Box>
				);
			case 'Joiner':
				return (
					<Box p={2}>
						<Button variant="contained" color="primary">
							共乘聊天室
						</Button>
					</Box>
				);
			case 'Ended':
				return (
					<Box p={2}>
						<Grid container spacing={2} alignItems="center">
							<Grid item>
								<Button variant="contained" color="primary">
									我要付款共乘
								</Button>
							</Grid>
							<Grid item>
								<Typography sx={{ color: 'red' }}>
									共乘費用(Carpool-Money): {item["共乘費用"]}
								</Typography>
							</Grid>
						</Grid>
					</Box>
				);
			default:
				return null;
		}
	};

	return (
		<Card key={item.id} variant="outlined" className="result-card">
			<CardContent>
				<Box display="flex">
					<Grid container spacing={2} sx={{ flex: '30%' }}>
						<Grid item xs={12}>
							<Typography>{`發起人: ${item.launcher}`}</Typography>
						</Grid>
						<Grid item xs={12}>
							<Typography>{`目前共乘人數: ${item.num}`}</Typography>
						</Grid>
						<Grid item xs={12}>
							<Typography>{`共乘方式: ${item.carpool_attribute}`}</Typography>
						</Grid>
					</Grid>
					<Grid container spacing={2}>
						<Grid item xs={12}>
							<Typography>{`共乘時間: ${item.time}`}</Typography>
						</Grid>
						<Grid item xs={12}>
							<Typography>{`共乘路線: ${item.route.join(' -> ')}`}</Typography>
						</Grid>
						<Grid item xs={12}>
							<Typography>{`共乘ID: ${item.id}`}</Typography>
						</Grid>
					</Grid>
				</Box>
			</CardContent>
			<Divider />
			{renderActionButton()}
		</Card>
	);
};

export default CarpoolCard;
