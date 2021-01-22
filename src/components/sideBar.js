import React from 'react';

import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import { makeStyles } from '@material-ui/core/styles';
import { NavLink } from "react-router-dom";

const SideBar = () => {
	const classes = useStyles();
	return (
		<React.Fragment>
			<Divider />
			<List>
				<ListItem button component={NavLink} to='/home'  activeClassName={classes.selected} >
					<ListItemIcon><InboxIcon /> </ListItemIcon>
					<ListItemText primary="home" />
				</ListItem>
				<ListItem button component={NavLink} to='/home2' activeClassName={classes.selected}>
					<ListItemIcon><InboxIcon /> </ListItemIcon>
					<ListItemText primary="home2" />
				</ListItem>
			</List>
			<Divider />
			<List>
				<ListItem button>
					<ListItemIcon><InboxIcon /> </ListItemIcon>
					<ListItemText primary="Text 1" />
				</ListItem>
				<ListItem button >
					<ListItemIcon><InboxIcon /> </ListItemIcon>
					<ListItemText primary="Text 2" secondary="sss" />
				</ListItem>
			</List>
		</React.Fragment>
	)
}

const useStyles = makeStyles((theme) => ({
	selected: {
		backgroundColor : 'aqua'
	}
}));

export default SideBar