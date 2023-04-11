import { USER, ADMIN_PANEL_CONSTANTS, RESTAURANTS_DATA, ORDERS_DATA, SELECTED_RESTAURANT, CUSTOMERS_DATA } from "../../Constants/reduxTypes";

const initialState = {
  user: null,
  adminPanelConstants: null,
  allRestaurants: [],
  allOrders: [],
  selectedRestaurant: null,
  allCustomers: [],
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case USER:
      return { ...state, user: payload };
    case ADMIN_PANEL_CONSTANTS:
      return { ...state, adminPanelConstants: payload };
    case RESTAURANTS_DATA:
      return { ...state, allRestaurants: payload }
    case ORDERS_DATA:
      return { ...state, allOrders: payload }
    case SELECTED_RESTAURANT:
      return { ...state, selectedRestaurant: payload }
    case CUSTOMERS_DATA:
      return { ...state, allCustomers: payload }

    default:
      return state;
  }
};
