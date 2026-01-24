import {getAuth, GoogleAuthProvider} from "firebase/auth"
import { initializeApp } from "firebase/app";
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY ,
  authDomain: "e-commerce-37ee8.firebaseapp.com",
  projectId: "e-commerce-37ee8",
  storageBucket: "e-commerce-37ee8.firebasestorage.app",
  messagingSenderId: "805281557523",
  appId: "1:805281557523:web:5824f89c2b82b9c58a23e6",
  measurementId: "G-GXM7H3TPYH"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const provider = new GoogleAuthProvider()


export {auth , provider}




