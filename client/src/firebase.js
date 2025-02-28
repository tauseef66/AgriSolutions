// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyDXOnu3EUlyacCxOyQewAOY0LcZOB0mhlw",
//   authDomain: "agrisolutions-cb9f8.firebaseapp.com",
//   projectId: "agrisolutions-cb9f8",
//   storageBucket: "agrisolutions-cb9f8.firebasestorage.app",
//   messagingSenderId: "979546217033",
//   appId: "1:979546217033:web:f8a522f155be071522bd98",
//   measurementId: "G-Y4D2K66M63"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);


import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDXOnu3EUlyacCxOyQewAOY0LcZOB0mhlw",
  authDomain: "agrisolutions-cb9f8.firebaseapp.com",
  projectId: "agrisolutions-cb9f8",
  storageBucket: "agrisolutions-cb9f8.appspot.com",
  messagingSenderId: "979546217033",
  appId: "1:979546217033:web:f8a522f155be071522bd98",
  measurementId: "G-Y4D2K66M63"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider, signInWithPopup };