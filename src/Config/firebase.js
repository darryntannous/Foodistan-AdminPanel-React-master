import * as firebase from "firebase";
var config = {
  apiKey: "AIzaSyDmWSSMwj7c43sv_kiIkSsl-2D2m4hBBMw",
  authDomain: "sunny-density-238208.firebaseapp.com",
  databaseURL: "https://sunny-density-238208.firebaseio.com",
  projectId: "sunny-density-238208",
  storageBucket: "sunny-density-238208.appspot.com",
  messagingSenderId: "637055851831",
  appId: "1:637055851831:web:76679bbac8e37f7e"
};
firebase.initializeApp(config);
const DB = firebase.firestore();
DB.enablePersistence()
  .catch(err => console.log(err, ' error in persisting the database'))

export { firebase, DB };
