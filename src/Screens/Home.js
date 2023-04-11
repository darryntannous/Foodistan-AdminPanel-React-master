import React, { useState, useEffect } from 'react';

import 'typeface-roboto';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import Wrapper from '../Components/Wrapper';
import { login, forgetPassword } from '../Redux/actions/authAction';
import { store } from '../Redux/store';
import { PRIMARY } from '../Constants/colors';

import { DASHBOARD } from '../Constants/routesName';

const useStyles = makeStyles({
	welcomeText: {
		textTransform: 'uppercase'
	},
	noteText: {
		// marginTop: 50,
		marginBottom: 50,
		textTransform: 'capitalize'
	},
	paper: {
		padding: 20
	},
	forgetPassword: {
		textDecoration: 'underline',
		cursor: 'pointer'
	},
	box: {
		marginTop: '10vh',
		position: 'sticky',
		backgroundColor: 'transparent'
	}
});

const HomeScreen = props => {
	const classes = useStyles();

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [user, setUser] = useState();
	const [togglePassLogin, setTogglePassLogin] = useState(false);

	useEffect(() => {
		getDataFromStore();
		const unsubscribe = store.subscribe(getDataFromStore);
		return () => unsubscribe();
	}, []);

	useEffect(() => {
		user && props.history.replace(DASHBOARD);
	}, [user]);

	const getDataFromStore = () => {
		const { authReducer } = store.getState();
		setUser(authReducer.user);
	};

	const handleLogin = async () => {
		// login("admin@plai.app", "plai_admin_@pp");
		const error = await login(email, password);
		if (error) {
			alert(error);
			return;
		}
		setEmail('');
		setPassword('');
		props.history.replace(DASHBOARD);
	};

	const _togglePassLogin = async () => {
		setTogglePassLogin(!togglePassLogin);
	};

	const handleForgetPassword = async () => {
		const error = await forgetPassword(email);
		if (error) {
			alert(error);
			return;
		}
		setEmail('');
		setTogglePassLogin(!togglePassLogin);
	};

	return (
		<Wrapper parentStyle={{ backgroundColor: PRIMARY, height: '50vh' }}>
			<Box
				display='flex'
				justifyContent='center'
				alignItems='center'
				flexDirection='column'
				p={5}
				bgcolor='background.paper'
				className={classes.box}
			>
				<div
					style={{
						// width: "100%",
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						marginTop: '-8vh',
						// marginBottom: '10vh'
					}}
				>
					<img
						src={require('../assets/logo_small.png')}
						alt='plai-logo'
						style={{
							width: 120,
							// height: 100,
							padding: 20
						}}
					/>
				</div>
				<Paper className={classes.paper} elevation={20}>
					{/* <Typography
            variant="h2"
            className={classes.welcomeText}
            align="center"
            color="textSecondary"
          >
            Welcome Admin
          </Typography> */}

					<Typography
						variant='h4'
						className={classes.noteText}
						align='center'
					// color="textSecondary"
					>
						{!togglePassLogin
							? 'Please login to continue'
							: 'Enter email address!'}
					</Typography>

					<div style={{ display: 'flex', flexDirection: 'column' }}>
						<>
							<TextField
								autoFocus
								margin='dense'
								id='email'
								label='Email Address'
								type='email'
								fullWidth
								value={email}
								onChange={event => setEmail(event.target.value)}
							/>
							{!togglePassLogin && (
								<TextField
									margin='dense'
									id='password'
									label='Password'
									type='password'
									fullWidth
									value={password}
									onChange={event => setPassword(event.target.value)}
								/>
							)}
						</>
						<Typography
							color='primary'
							variant='subtitle2'
							className={classes.forgetPassword}
							onClick={_togglePassLogin}
						>
							{!togglePassLogin ? 'Forget password' : 'back to login'}
						</Typography>
						<Button
							onClick={!togglePassLogin ? handleLogin : handleForgetPassword}
							style={{ marginTop: 60 }}
							color='primary'
							variant='contained'
							fullWidth
						>
							{!togglePassLogin ? 'Login' : 'Reset password'}
						</Button>
					</div>
				</Paper>
			</Box>
		</Wrapper>
	);
};

export default HomeScreen;
