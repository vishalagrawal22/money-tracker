import admin from "firebase-admin";

const app =
  admin.apps.length && admin.apps[0] !== null
    ? admin.apps[0]
    : admin.initializeApp({
        credential: admin.credential.applicationDefault(),
      });

const auth = admin.auth(app);

export { auth };
