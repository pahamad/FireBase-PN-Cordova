import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAIATwBCnYxsSuwoD4RAqkQV3lntJnZejg",
  authDomain: "test-7b66f.firebaseapp.com",
  projectId: "test-7b66f",
  storageBucket: "test-7b66f.appspot.com",
  messagingSenderId: "1005462636402",
  appId: "1:1005462636402:web:c64564c20b9b0b1ac83feb",
  measurementId: "G-N47WBVYKYG"
};

const firebaseApp = initializeApp(firebaseConfig);
const messaging = getMessaging(firebaseApp);

export const fetchToken = (setTokenFound, setToken) => {
  return getToken(messaging, {vapidKey: 'BG3zz9ZcBcNmulZjGJQlS8RtBxWH-BViMkSDM2-RTzbMR_21_RYVGIvrX7LtZ0RlH27a-B098j12iIf0BTLnlrE'}).then((currentToken) => {
    if (currentToken) {
      console.log('current token for client: ', currentToken);
      setTokenFound(true);
      setToken(currentToken);
      // Track the token -> client mapping, by sending to backend server
      // show on the UI that permission is secured
    } else {
      console.log('No registration token available. Request permission to generate one.');
      setTokenFound(false);
      // shows on the UI that permission is required
    }
  }).catch((err) => {
    console.log('An error occurred while retrieving token. ', err);
    // catch error while creating client token
  });
}

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
});
