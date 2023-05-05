import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object
const firebaseConfig = {
    apiKey: "AIzaSyAIntlppM_gZTwd6NQfAP8mqEeusgkRoLk",
    authDomain: "oneday-5f5bb.firebaseapp.com",
    databaseURL: "https://oneday-5f5bb-default-rtdb.firebaseio.com",
    projectId: "oneday-5f5bb",
    storageBucket: "oneday-5f5bb.appspot.com",
    messagingSenderId: "288807207053",
    appId: "1:288807207053:web:f5ecc32cd12a2c823222c4",
    measurementId: "G-BX09YJ558E"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);


// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);