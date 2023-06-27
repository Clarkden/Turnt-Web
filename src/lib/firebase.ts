import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, initializeFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage, ref } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDsuWg4fW0mizZXH-5lzWXCc5k_unv8HIg",
  authDomain: "lit-party-platform.firebaseapp.com",
  projectId: "lit-party-platform",
  storageBucket: "lit-party-platform.appspot.com",
  messagingSenderId: "824597449106",
  appId: "1:824597449106:web:363a3283a42a8fadfa194b",
  measurementId: "G-Q47YF572MC",
};

export const app = initializeApp(firebaseConfig);

export const db = initializeFirestore(app, {
  ignoreUndefinedProperties: true,
});
export const auth = getAuth(app);
export const storage = getStorage(app);
export const storageRef = ref(storage, "images/");
