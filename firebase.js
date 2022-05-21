// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import * as Auth from "firebase/auth";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAyxMijsO4TXiljsFeKvFd6ThgBDuIh47g",
  authDomain: "gain-impact-88fa6.firebaseapp.com",
  projectId: "gain-impact-88fa6",
  storageBucket: "gain-impact-88fa6.appspot.com",
  messagingSenderId: "66779437905",
  appId: "1:66779437905:web:70a3a30176d8c07629d170",
  measurementId: "G-X10T3XVMFB",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const db = getFirestore();
const auth = Auth;
const storage = getStorage();

export { db, storage, auth };
