// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC1iA-8BEeh9rvc5CJaaEKYa61yovGSBa8",
  authDomain: "undersounds-fb362.firebaseapp.com",
  projectId: "undersounds-fb362",
  storageBucket: "undersounds-fb362.firebasestorage.app",
  messagingSenderId: "822025298894",
  appId: "1:822025298894:web:e82b87b47c1a019b3a019f",
  measurementId: "G-DZRGW4YG5V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export {app, analytics};