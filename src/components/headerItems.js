import React from 'react';

import {makeStyles} from '@material-ui/core/styles';
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import IconButton from '@material-ui/core/IconButton';
import NotificationsIcon from '@material-ui/icons/Notifications';
import Badge from "@material-ui/core/Badge";
import AccountCircle from "@material-ui/icons/AccountCircle";


const HeaderItems = () => {

	const classes = useStyles();
	const [anchorEl, setAnchorEl] = React.useState(null);
	const isMenuOpen = Boolean(anchorEl);

	const handleProfileMenuOpen = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleMenuClose = () => {
		setAnchorEl(null);
	};

	const menuId = 'redmine-title';


	const renderMenu = (
		<Menu
			anchorEl={anchorEl}
			anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
			id={menuId}
			keepMounted
			transformOrigin={{ vertical: 'top', horizontal: 'right' }}
			open={isMenuOpen}
			onClose={handleMenuClose}
		>
			<MenuItem onClick={handleMenuClose}>Profile</MenuItem>
			<MenuItem onClick={handleMenuClose}>Logout</MenuItem>
		</Menu>
	);

	return (
		<div className={classes.sectionDesktop}>
			<IconButton aria-label="show 4 new notifications" color="inherit">
				<Badge badgeContent={4} color="secondary">
					<NotificationsIcon />
				</Badge>
			</IconButton>
			<IconButton
				edge="end"
				aria-label="account of current user"
				aria-controls={menuId}
				aria-haspopup="true"
				onClick={handleProfileMenuOpen}
				color="inherit"
			>
				<AccountCircle />
			</IconButton>
			{renderMenu}
		</div>
	)
}

const useStyles = makeStyles((theme) => ({
	sectionDesktop: {
		display: 'flex',
		[theme.breakpoints.up('md')]: {
			display: 'flex',
		},
	}
}));

export default HeaderItems;