import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCtnzHoasYcJysnX96JNgE_uTaOP0lLgjs",
  authDomain: "task-scheduler-b7f9e.firebaseapp.com",
  projectId: "task-scheduler-b7f9e",
  storageBucket: "task-scheduler-b7f9e.appspot.com",
  messagingSenderId: "963971397523",
  appId: "1:963971397523:web:23bf4338301f199b621a66",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
