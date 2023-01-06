import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";

import { auth } from "../../firebase-config";

const googleProvider = new GoogleAuthProvider();
export async function loginOrRegisterWithGooglePopup() {
  await signInWithPopup(auth, googleProvider);
}

export async function logout() {
  await signOut(auth);
}

export function useUser() {
  const [user, loading, error] = useAuthState(auth);
  return {
    user,
    loading,
    error,
  };
}

export async function getAuthToken() {
  const authToken = await auth.currentUser?.getIdToken();
  return authToken;
}
