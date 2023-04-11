import { RESTAURANTS, ORDER_MANAGEMENT, RESTAURANT_FORM, CUSTOMER_MANAGEMENT, REVIEW_MANAGEMENT, ADMIN_SETTINGS } from './routesName';

export const DASHBOARD_CARDS = [
  {
    id: 1,
    title: "Restaurant",
    icon: require("../assets/influencer.png"),
    routeName: RESTAURANT_FORM,
    description: '',
  },
  {
    id: 2,
    title: "Order Management",
    icon: require("../assets/order-mgmt.png"),
    routeName: ORDER_MANAGEMENT,
    description: '',
  },
  {
    id: 4,
    title: "Review Management",
    icon: require("../assets/stars.png"),
    routeName: REVIEW_MANAGEMENT,
    description: '',
  },
  {
    id: 3,
    title: "Customer Management",
    icon: require("../assets/business.png"),
    routeName: CUSTOMER_MANAGEMENT,
    description: '',
  },
  {
    id: 5,
    title: "Admin Settings",
    icon: require("../assets/admin-settings.png"),
    routeName: ADMIN_SETTINGS,
    description: '',
  },
  // {
  //   id: 6,
  //   title: "All Restaurants",
  //   icon: require("../assets/allRestaurants.png"),
  //   routeName: RESTAURANTS,
  //   description: '',
  // },
];
