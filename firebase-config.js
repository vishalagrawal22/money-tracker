import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAwjt_sJXtxDmMdc9ep04ypZylNbia9nbE",
  authDomain: "money-tracker-e68a7.firebaseapp.com",
  projectId: "money-tracker-e68a7",
  storageBucket: "money-tracker-e68a7.appspot.com",
  messagingSenderId: "1016553994686",
  appId: "1:1016553994686:web:4538484b01f6dc2402a1ef",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
