import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object
const firebaseConfig = {
    apiKey: "AIzaSyCVOwLtNfI8ECe1Q4fFC-paqpnFXcCoLks",
    authDomain: "travel-buddy-e6b3a.firebaseapp.com",
    projectId: "travel-buddy-e6b3a",
    storageBucket: "travel-buddy-e6b3a.appspot.com",
    messagingSenderId: "1060985104581",
    appId: "1:1060985104581:web:c34818cf0cc177ae1168ac",
    measurementId: "G-E1TGKMT5NB"
  };
// Initialize Firebase
export const app = initializeApp(firebaseConfig);


// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);