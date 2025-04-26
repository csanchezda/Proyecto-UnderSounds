import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyC1iA-8BEeh9rvc5CJaaEKYa61yovGSBa8",
    authDomain: "undersounds-fb362.firebaseapp.com",
    databaseURL: "https://undersounds-fb362-default-rtdb.firebaseio.com",
    projectId: "undersounds-fb362",
    storageBucket: "undersounds-fb362.firebasestorage.app",
    messagingSenderId: "822025298894",
    appId: "1:822025298894:web:e82b87b47c1a019b3a019f",
    measurementId: "G-DZRGW4YG5V"
  };

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);