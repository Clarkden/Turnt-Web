import { cert, getApps, initializeApp, applicationDefault } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
import {
  FIREBASE_ADMIN_PRIVATE_KEY,
  FIREBASE_ADMIN_CLIENT_EMAIL,
} from "$env/static/private";
import { PUBLIC_FIREBASE_PROJECT_ID } from "$env/static/public";
import { credential } from "firebase-admin";
// import serviceAccount from "../../lit-party-platform-firebase-adminsdk-b9jfm-6d612e962c.json"

async function makeApp() {
  const apps = getApps();
  if (apps.length > 0) {
    return apps[0]!;
  }

  console.log(FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, '\n'))

  return initializeApp({
    credential: await cert({
      privateKey: FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, '\n'),
      clientEmail: FIREBASE_ADMIN_CLIENT_EMAIL,
      projectId: PUBLIC_FIREBASE_PROJECT_ID,
    }),
    // credential: applicationDefault(),
    // projectId: PUBLIC_FIREBASE_PROJECT_ID,
    // databaseURL: `https://${PUBLIC_FIREBASE_PROJECT_ID}.firebaseio.com`,
    // credential: credential.cert(serviceAccount),
  });
}
export const firebase = await makeApp();
export const auth = getAuth(firebase);
export const firestore = getFirestore();
