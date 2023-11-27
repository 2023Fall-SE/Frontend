import React from "react";
import { AppBar, Toolbar, Typography, IconButton } from "@mui/material";
import PaidIcon from '@mui/icons-material/Paid';
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useNavigate, useLocation } from "react-router-dom";

const Header = () => {
	const navigate = useNavigate();
	const location = useLocation();

	// Function to extract the page name from the URL
	const getPageName = () => {
		const paths = location.pathname.split("/");
		return paths[paths.length - 1];
	};

	return (
		<AppBar position="static" sx={{ marginBottom: 0 }}>
			{/* Set marginBottom to 0 to remove the default margin */}
			<Toolbar>
				<Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
					{getPageName()}
				</Typography>
				<IconButton color="inherit" onClick={() => navigate("/add")}>
					<PaidIcon />
				</IconButton>
				<IconButton color="inherit">
					<NotificationsIcon />
				</IconButton>
				<IconButton color="inherit">
					<AccountCircleIcon />
				</IconButton>
			</Toolbar>
		</AppBar>
	);
};

export default Header;
