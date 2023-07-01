import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyCFa9P0qUHocc88bele48xEsAmtGmZ082c",
    authDomain: "whatsapp-clone-43f42.firebaseapp.com",
    projectId: "whatsapp-clone-43f42",
    storageBucket: "whatsapp-clone-43f42.appspot.com",
    messagingSenderId: "1091396683444",
    appId: "1:1091396683444:web:d81fb2fb728ec9435cb9e1",
    measurementId: "G-GJJXS72YYP"
};

const app = initializeApp(firebaseConfig);
export const fireBaseAuth = getAuth(app);