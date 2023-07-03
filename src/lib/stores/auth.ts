import cookie from "cookie";
import { browser } from "$app/environment";
import {
  GoogleAuthProvider,
  type User,
  signInWithRedirect,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  signInWithPopup,
  onIdTokenChanged,
  getIdToken,
  sendPasswordResetEmail,
} from "firebase/auth";
import { writable } from "svelte/store";
import { auth } from "../firebase";

export const user = writable<User | null>(null);

export async function signup(
  email: string,
  password: string
): Promise<boolean> {
  try {
    await createUserWithEmailAndPassword(auth, email, password);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function resetPassword(email: string): Promise<boolean> {
  try {
    await sendPasswordResetEmail(auth, email);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function logout(): Promise<boolean> {
  try {
    await signOut(auth);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function login(email: string, password: string): Promise<boolean> {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function loginWithGoogle(): Promise<boolean> {
  try {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

if (browser) {
  onIdTokenChanged(auth, async (newUser: any) => {
    const tokenCurrentlySet =
      cookie.parse(document.cookie)["token"] !== undefined;
    const token = newUser ? await newUser?.getIdToken() : undefined;
    document.cookie = cookie.serialize("token", token ?? "", {
      path: "/",
      maxAge: token ? undefined : 0,
    });
    user.set(newUser);

    if (!tokenCurrentlySet && token) {
      document.location.reload();
    }
  });

  // refresh the ID token every 10 minutes
  setInterval(async () => {
    if (auth.currentUser) {
      await getIdToken(auth.currentUser, true);
    }
  }, 10 * 60 * 1000);
}
