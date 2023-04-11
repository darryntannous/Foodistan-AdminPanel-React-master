import React, { useEffect, useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
// import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Wrapper from '../Components/Wrapper';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import AddRoundedIcon from '@material-ui/icons/AddRounded';

import _ from 'lodash';

import { DASHBOARD_CARDS } from '../Constants/data';
import { store } from '../Redux/store';
import { SELECTED_RESTAURANT } from '../Constants/reduxTypes'
import { DISPATCH_TO_REDUX } from '../Constants/functions';

const useStyles = makeStyles({
	card: {
		width: 245,
		marginRight: '1%',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'space-between',
		marginBottom: '1%'
		// "&:hover": {}
	},
	cardImg: {
		marginTop: 80,
		marginBottom: 70,
		objectFit: 'contain'
	},
	title: { fontWeight: 'bolder' }
});

const DashboardScreen = props => {
	const classes = useStyles();
	const [cardsData, setCardsData] = useState(DASHBOARD_CARDS);
	const [selectedRestaurant, setSelectedRestaurant] = useState(null);

	const getStateFromStore = () => {
		const { selectedRestaurant, allOrders } = store.getState().authReducer;
		setSelectedRestaurant(selectedRestaurant);
		setCardsData(prevState => {
			let data = [...prevState];
			data = data.map(card => {
				if (card.id === 2) card.description = `Total Orders: ${_.filter(allOrders, ['snapshot.restaurantId', selectedRestaurant?.id]).length}`
				return card;
			});
			return data;
		})
	}

	useEffect(() => {
		// props.history.push("/adminSettings");
		getStateFromStore();
		const unsubscribe = store.subscribe(getStateFromStore);
		return () => {
			unsubscribe();
		}
	}, []);

	const card_jsx = card => {
		const cardIds = [3, 5];
		const notDisabled = !cardIds.includes(card.id);
		const disabled = notDisabled && !selectedRestaurant
		return (
			<Card key={card.id} className={classes.card} elevation={5}>
				{/* <CardActionArea onClick={() => {}}> */}
				<CardContent>
					<Typography
						gutterBottom
						variant='h5'
						component='h2'
						className={classes.title}
					>
						{card.title}
					</Typography>
					<Typography variant="body2" color="textSecondary" component="p">{card.description}</Typography>
					<CardMedia
						component='img'
						alt='Contemplative Reptile'
						height='100'
						image={card.icon}
						title='Contemplative Reptile'
						className={classes.cardImg}
					/>
				</CardContent>
				{/* </CardActionArea> */}
				<CardActions>
					<Button
						size='medium'
						color='primary'
						variant='contained'
						fullWidth
						disabled={disabled}
						onClick={() => {
							if (disabled) {
								alert('Please select restaurant first!');
								return;
							}
							props.history.push(card.routeName);
						}}
					>
						{disabled ? 'Select restaurant' : <>Go < ArrowForwardIcon fontSize='small' /></>}
					</Button>
					{/* {
						card?.routeNameII &&
						<Button
							size='medium'
							color='primary'
							variant='contained'
							fullWidth
							onClick={() => {
								DISPATCH_TO_REDUX(SELECTED_RESTAURANT, null);
								props.history.push(card?.routeNameII);
							}}
						>
							{
								disabled ? 'Add New Restaurant' : <>Add <AddRoundedIcon fontSize='small' /></>
							}
						</Button>
					} */}
				</CardActions>
			</Card>
		);
	};

	return <Wrapper parentStyle={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>{cardsData.map(card_jsx)}</Wrapper>;
};

export default DashboardScreen;
