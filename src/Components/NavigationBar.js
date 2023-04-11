import React, { useState, useEffect } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from "@material-ui/core/Button";
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import IconButton from '@material-ui/core/IconButton';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

import _ from 'lodash';

import { store } from '../Redux/store';
import { logout } from '../Redux/actions/authAction';
import { HOME, CHANGE_PASSWORD, DASHBOARD, RESTAURANT_FORM } from '../Constants/routesName';
import { PRIMARY } from '../Constants/colors';
import { DISPATCH_TO_REDUX } from '../Constants/functions';
import { SELECTED_RESTAURANT } from '../Constants/reduxTypes';

const useStyles = makeStyles(theme => ({
	root: {
		flexGrow: 1
	},
	menuButton: {
		marginRight: theme.spacing(2)
	},
	toolbar: {
		display: 'flex',
		alignItems: 'center',
		flexDirection: 'row',
		backgroundColor: PRIMARY,
		justifyContent: 'space-between',
	},
	title: {
		// flexGrow: 1,
		'&:hover': {
			textDecoration: 'underline',
			cursor: 'pointer'
		}
	},
	formControl: {
		margin: theme.spacing(1),
		minWidth: 150,
		backgroundColor: '#fafafa',
		borderRadius: theme.spacing(1)
	},
	selectEmpty: {
		// color: '#fff'
		height: theme.spacing(5.5)
	}
}));

const NavigationBar = props => {
	const classes = useStyles();
	const [user, setUser] = useState(store.getState().authReducer.user);
	const [anchorEl, setAnchorEl] = React.useState(null);
	const [selectedRestaurantId, setSelectedRestaurantId] = useState('disabled');
	const [restaurants, setRestaurants] = useState([]);
	const open = Boolean(anchorEl);

	useEffect(() => {
		getDataFromStore();
		const unsubscribe = store.subscribe(getDataFromStore);
		return () => unsubscribe();
	}, []);

	const getDataFromStore = () => {
		const { authReducer } = store.getState();
		!authReducer.user && props.history.replace(HOME);
		setUser(authReducer.user);
		setRestaurants([...authReducer.allRestaurants]);
		setSelectedRestaurantId(authReducer.selectedRestaurant?.id || 'disabled');
	};

	const handleLogout = async () => {
		await logout();
		props.history.replace(HOME);
		handleClose();
	};

	const handleChangePassword = () => {
		props.history.replace(CHANGE_PASSWORD);
		handleClose();
	};

	const handleMenu = event => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleRestaurantSelection = (e) => {
		const restaurantId = e.target.value;
		setSelectedRestaurantId(restaurantId);
		DISPATCH_TO_REDUX(SELECTED_RESTAURANT, _.find(restaurants, ['id', restaurantId]));
	}

	return (
		<div className={classes.root}>
			<AppBar position='static'>
				<Toolbar className={classes.toolbar}>
					{/* <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
          >
            <MenuIcon />
          </IconButton> */}
					<Typography
						variant='h6'
						className={classes.title}
						onClick={() => {
							props.history.push(DASHBOARD);
						}}
					>
						Foodistan Dashboard
					</Typography>
					{user && (
						<div style={{ display: 'flex', alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
							<div>
								<Button
									size='large'
									color='secondary'
									variant='contained'
									fullWidth
									onClick={() => {
										DISPATCH_TO_REDUX(SELECTED_RESTAURANT, null);
										props.history.push(RESTAURANT_FORM);
									}}
								>
									Add New Restaurant
								</Button>
							</div>
							<div>
								<FormControl className={classes.formControl}>
									<Select
										autoWidth
										variant="outlined"
										color='secondary'
										value={selectedRestaurantId}
										onChange={handleRestaurantSelection}
										className={classes.selectEmpty}
										inputProps={{ 'aria-label': 'Without label', }}
									>
										<MenuItem value={'disabled'} disabled>Select Restaurant</MenuItem>
										{
											restaurants.map(obj => (<MenuItem key={obj.id} value={obj.id}>{obj.name}</MenuItem>))
										}
									</Select>
								</FormControl>
							</div>
							<IconButton
								aria-label='account of current user'
								aria-controls='menu-appbar'
								aria-haspopup='true'
								onClick={handleMenu}
								color='inherit'
							>
								<AccountCircle />
							</IconButton>
							<Menu
								id='menu-appbar'
								anchorEl={anchorEl}
								anchorOrigin={{
									vertical: 'top',
									horizontal: 'right'
								}}
								keepMounted
								transformOrigin={{
									vertical: 'top',
									horizontal: 'right'
								}}
								open={open}
								onClose={handleClose}
							>
								<MenuItem onClick={handleChangePassword}>
									Change Password
								</MenuItem>
								<MenuItem onClick={handleLogout}>Logout</MenuItem>
							</Menu>
						</div>
					)}
					{/* {user && (
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          )} */}
				</Toolbar>
			</AppBar>
		</div>
	);
};

export default NavigationBar;
