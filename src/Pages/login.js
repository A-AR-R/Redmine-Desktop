import React from "react";

import Paper from '@material-ui/core/Paper';
import clsx from 'clsx';
import { makeStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { useForm } from 'react-hook-form';
import { mainContext } from '../App';

const Login = () => {
	const classes = useStyles();
	const { register, handleSubmit, errors } = useForm();
	const { mainState, setMainState } = React.useContext(mainContext);

	const OnSubmit = (data) => {
		setMainState({
			...mainState,
			isLoggedIn: true
		})
	};
	return (
		<form className={classes.root} onSubmit={handleSubmit(OnSubmit)}>
			<Paper className={clsx(classes.loginBox)}>
				<Typography className={classes.title} >Login </Typography>
				<TextField
					id="outlined-basic"
					name='serverName'
					inputRef={register({ required: true })}
					label="Sever Name"
					defaultValue={mainState.serverName}
				/>
				<Typography color={"error"} className={classes.error}>
					{errors.serverName && 'empty'}
				</Typography>
				<TextField
					id="outlined-basic"
					name='username'
					inputRef={register({ required: true })}
					label="Username"
				/>
				<Typography color={"error"} className={classes.error}>
					{errors.username && 'empty'}
				</Typography>
				<TextField
					id="outlined-password-input"
					name='password'
					inputRef={register({ required: true })}
					label="Password"
					type="password"
					autoComplete="current-password"
				/>
				<Typography color={"error"} className={classes.error}>
					{errors.password && 'empty'}
				</Typography>
				<Button
					className={classes.submit}
					type="submit">
					Login
				</Button>
			</Paper>
		</form>
	)
};

const useStyles = makeStyles((theme) => ({
	root: {
		display: 'flex',
		justifyContent: "center",
		flexDirection: "column",
		alignItems: 'center',
		height: `100vh`,
	},
	loginBox: {
		display: 'flex',
		justifyContent: "center",
		flexDirection: "column",
		alignItems: 'center',
		padding: '20px',
		'& > div': {
			margin: '5px',
			width: '250px'
		}
	},
	title: {
		fontSize: '30px',
		fontWeight: 'bold',
		paddingBottom: '10px'
	},
	submit: {
		marginTop: '10px'
	},
	error: {
		fontSize:'15px'
	}
}));


export default Login;