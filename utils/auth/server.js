import { auth } from "../../firebase-config/server";

export const UNAUTHENTICATED_ERROR = "unauthenticated";

export async function getUserId(req) {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const authToken = authHeader.substring(7, authHeader.length);
    if (authToken) {
      const { uid } = await auth.verifyIdToken(authToken);
      return uid;
    }
  }
  throw UNAUTHENTICATED_ERROR;
}

export async function getUserData(req) {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const authToken = authHeader.substring(7, authHeader.length);
    if (authToken) {
      const { uid, email } = await auth.verifyIdToken(authToken);
      return {
        uid,
        email,
      };
    }
  }
  throw UNAUTHENTICATED_ERROR;
}
