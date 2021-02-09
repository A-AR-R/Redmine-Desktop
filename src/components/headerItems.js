import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import IconButton from '@material-ui/core/IconButton';
import NotificationsIcon from '@material-ui/icons/Notifications';
import Badge from "@material-ui/core/Badge";
import AccountCircle from "@material-ui/icons/AccountCircle";
import CloseIcon from '@material-ui/icons/Close';
import { mainContext } from '../UserContext';
import TaskTimer from "../Timer";
import NotifyNewTask from "../NotifyNewTask";
const electron = window.require('electron');
const remote = electron.remote
const {BrowserWindow, dialog, Tray } = remote
const app = remote.app
var curWindow=null;
app.whenReady().then(() => {
	curWindow = remote.getCurrentWindow();
})

const HeaderItems = () => {

	const classes = useStyles();
	const [anchorEl, setAnchorEl] = React.useState(null);
	const isMenuOpen = Boolean(anchorEl);
	const { mainState, setMainState } = React.useContext(mainContext);

	const handleProfileMenuOpen = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleMenuClose = () => {
		setAnchorEl(null);
	};

	const menuId = 'redmine-title';
	const logout = () => {
		setMainState({
			...mainState,
			isLoggedIn: false,
		})
	}

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
			<MenuItem onClick={()=>{handleMenuClose(); logout();}}>Logout</MenuItem>
		</Menu>
	);

	return (
		<div className={classes.sectionDesktop}>
			<TaskTimer/>
			<NotifyNewTask/>
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
			<IconButton
                onClick={() => {
                    console.log("here")
					curWindow.hide()
                }
                }
				color="inherit"
			>
				<CloseIcon />
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