import React from "react";
import { Route, withRouter } from "react-router-dom";

import "./index.css";

import HomeScreen from "../Screens/Home";
import DashboardScreen from "../Screens/Dashboard";
import ChangePasswordScreen from "../Screens/ChangePassword";

import NavigationBar from "../Components/NavigationBar";
import {
  HOME,
  DASHBOARD,
  CHANGE_PASSWORD,
  RESTAURANT_FORM,
  RESTAURANTS,
  RESTAURANT_ID,
  ORDER_MANAGEMENT,
  CUSTOMER_MANAGEMENT,
  REVIEW_MANAGEMENT,
  ADMIN_SETTINGS
} from "../Constants/routesName";
import RestaurantFormScreen from '../Screens/RestaurantForm';
import RestaurantsScreen from '../Screens/Restaurants';
import OrderManagementScreen from '../Screens/OrderManagement';
import CustomerManagementScreen from '../Screens/CustomerManagement';
import ReviewManagementScreen from '../Screens/ReviewManagement';
import AdminSettingsScreen from '../Screens/AdminSettings';

const AppRoutes = props => (
  <div>
    {props.location.pathname !== "/" && <NavigationBar {...props} />}
    <Route exact path={HOME} component={HomeScreen} />
    <Route path={DASHBOARD} component={DashboardScreen} />
    <Route path={CHANGE_PASSWORD} component={ChangePasswordScreen} />
    <Route path={RESTAURANTS} component={RestaurantsScreen} />
    <Route path={RESTAURANT_ID} component={RestaurantFormScreen} />
    <Route path={RESTAURANT_FORM} component={RestaurantFormScreen} />
    <Route path={ORDER_MANAGEMENT} component={OrderManagementScreen} />
    <Route path={CUSTOMER_MANAGEMENT} component={CustomerManagementScreen} />
    <Route path={REVIEW_MANAGEMENT} component={ReviewManagementScreen} />
    <Route path={ADMIN_SETTINGS} component={AdminSettingsScreen} />
  </div>
);

export default withRouter(AppRoutes);
