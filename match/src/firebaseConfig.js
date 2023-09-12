// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD21_PUpBNMaYqH0jMjDjAXtoqoGMWuWB8",
  authDomain: "kara-3091d.firebaseapp.com",
  projectId: "kara-3091d",
  storageBucket: "kara-3091d.appspot.com",
  messagingSenderId: "115044992318",
  appId: "1:115044992318:web:b2a8aec0dfb22f03eb186f",
  measurementId: "G-CE0RRFZB7X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);