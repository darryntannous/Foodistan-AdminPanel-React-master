import _ from 'lodash'
import { firebase, DB } from '../../Config/firebase';
import { store } from '../../Redux/store';
import { USER, ADMIN_PANEL_CONSTANTS, RESTAURANTS_DATA, ORDERS_DATA, CUSTOMERS_DATA } from '../../Constants/reduxTypes';
import { DISPATCH_TO_REDUX } from '../../Constants/functions';

export const checkUser = () => {
	const { authReducer: { adminPanelConstants, allRestaurants, allOrders, allCustomers } } = store.getState();
	firebase.auth().onAuthStateChanged(user => {
		user = user.toJSON();
		// console.log(user, 'CheckUser');
		DISPATCH_TO_REDUX(USER, user ? user : null);
		if (user) {
			!adminPanelConstants &&
				getAdminPanelConstants();
			!allRestaurants.length &&
				getAllRestaurants();
			!allOrders.length &&
				getOrders();
			!allCustomers.length &&
				getAllCustomers();
		}
	});
};

export const login = async (email, password) => {
	try {
		const { user } = await firebase
			.auth()
			.signInWithEmailAndPassword(email, password);
		if (user)
			DISPATCH_TO_REDUX(USER, user.toJSON());
	} catch (error) {
		console.error(error);
		return error;
	}
};

export const logout = async () => {
	try {
		await firebase.auth().signOut();
		// console.log('logout');
		DISPATCH_TO_REDUX(USER, null);
	} catch (error) {
		console.error(error);
	}
};

export const forgetPassword = async email => {
	try {
		await firebase.auth().sendPasswordResetEmail(email);
		alert(`Password reset email send to ${email}`);
	} catch (error) {
		console.error(error);
		return error;
	}
};

export const resetPassword = async newPassword => {
	try {
		var user = firebase.auth().currentUser;
		await user.updatePassword(newPassword);
		alert('Password reset succesfully');
	} catch (error) {
		console.error(error);
		return error;
	}
};

const getAdminPanelConstants = async () => {
	DB.collection('ADMIN_PANEL').onSnapshot(snapshot => {
		const adminPanelConstants = {};
		snapshot.forEach(doc => {
			adminPanelConstants[doc.id] = doc.data();
		});
		if (snapshot.size === Object.keys(adminPanelConstants).length)
			DISPATCH_TO_REDUX(ADMIN_PANEL_CONSTANTS, adminPanelConstants)
	});
}

const getAllRestaurants = () => {
	DB.collection('companies').onSnapshot((snapshot) => {
		const data = [];
		snapshot.forEach(doc => {
			data.push(doc.data());
		});
		if (snapshot.size === data.length)
			DISPATCH_TO_REDUX(RESTAURANTS_DATA, data);
	})

}

const getOrders = () => {
	DB.collection("orders")
		// .where("status", "==", "Pending")
		.onSnapshot(snapshot => {
			const orders = [];
			snapshot.forEach(async doc => {
				const data = doc.data();
				const restaurant = (await DB.collection('companies').doc(data?.restaurantId).get()).data();
				const customer = (await DB.collection('users').doc(data?.userId).get()).data();

				const allItems = [];
				restaurant.menu.forEach(cat => {
					const items = _.filter(cat.items, o => Boolean(_.find(data?.cartItems, ['id', o.id])));
					allItems.push(items);
				});
				const obj = {
					snapshot: data,
					id: data.id,
					items: allItems.flat(),
					restaurant,
					customer,
					status: data.status,
					timestamp: data.timestamp,
				}
				orders.push(obj);
			});
			// console.log(snapshot.size)
			// if (snapshot.size === orders.length)
			DISPATCH_TO_REDUX(ORDERS_DATA, orders);
		})
}

export const updateOrder = async (docId, data) => {
	await DB.collection('orders').doc(docId).update(data);
}

const getAllCustomers = () => {
	DB.collection('users').onSnapshot((snapshot) => {
		const users = [];
		snapshot.forEach(doc => {
			users.push(doc.data());
		});

		if (snapshot.size === users.length) {
			DISPATCH_TO_REDUX(CUSTOMERS_DATA, users);
		}
	})
}
