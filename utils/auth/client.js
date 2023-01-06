import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";

import { auth } from "../../firebase-config";

export const USER_NOT_FOUND = "auth/user-not-found";
export const WRONG_PASSWORD = "auth/wrong-password";
export const EMAIL_ALREADY_TAKEN = "auth/email-already-in-use";
export const INVALID_EMAIL = "auth/invalid-email";

export async function loginWithEmailAndPassword(email, password) {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    const authError = err;
    if (authError.code === "auth/user-not-found") {
      throw USER_NOT_FOUND;
    } else if (authError.code === "auth/wrong-password") {
      throw WRONG_PASSWORD;
    }
    throw authError.message;
  }
}

const googleProvider = new GoogleAuthProvider();
export async function loginOrRegisterWithGooglePopup() {
  await signInWithPopup(auth, googleProvider);
}

export async function logout() {
  await signOut(auth);
}

export async function registerWithEmailAndPassword(email, password) {
  try {
    await createUserWithEmailAndPassword(auth, email, password);
  } catch (err) {
    const authError = err;
    if (authError.code === EMAIL_ALREADY_TAKEN) {
      throw EMAIL_ALREADY_TAKEN;
    } else if (authError.code === INVALID_EMAIL) {
      throw INVALID_EMAIL;
    }
    throw authError.message;
  }
}

export function useUser() {
  const [user, loading, error] = useAuthState(auth);
  return {
    user,
    loading,
    error: error,
  };
}

export async function getAuthToken() {
  const authToken = await auth.currentUser?.getIdToken();
  return authToken;
}
