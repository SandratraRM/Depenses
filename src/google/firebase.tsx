// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAntEuv8ugrVYuH3QsdbhOG_yGQEXLc9dM",
  authDomain: "depenses-app-sandratra.firebaseapp.com",
  projectId: "depenses-app-sandratra",
  storageBucket: "depenses-app-sandratra.appspot.com",
  messagingSenderId: "34971248906",
  appId: "1:34971248906:web:a5ea52f2298f55d05f72f3"
};

// Initialize Firebase
const firebase = initializeApp(firebaseConfig);

export const analytics = getAnalytics(firebase);
export default firebase;