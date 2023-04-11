import React, { useEffect } from "react";

import { Provider } from "react-redux";
import { store } from "./Redux/store";
import { BrowserRouter as Router } from "react-router-dom";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import AppRoutes from "./Routes";
import { checkUser } from "./Redux/actions/authAction";
import { DB } from './Config/firebase';
import { PRIMARY, SECONDARY } from './Constants/colors';

const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
    suppressDeprecationWarnings: true
  },
  palette: {
    primary: {
      main: PRIMARY
    },
    secondary: {
      main: SECONDARY
    }
  }
});

const App = props => {
  useEffect(() => {
    checkUser();
    // DB.enablePersistence()
    // .then(() => console.log('**** Persistence Enabled! ****'))
    // .catch(err => console.log(err, ' error in persisting the database'))
  }, []);

  return (
    <Provider store={store}>
      {/* <PersistGate loading={null} persistor={persistor}> */}
      <Router>
        <MuiThemeProvider theme={theme}>
          <AppRoutes />
        </MuiThemeProvider>
      </Router>
      {/* </PersistGate> */}
    </Provider>
  );
};

export default App;
