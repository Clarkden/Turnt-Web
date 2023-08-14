import { auth } from "$lib/firebaseAdmin";
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { doc, getDoc } from "firebase/firestore";
import { db } from "$lib/firebase";

export async function load({ cookies }) {
  try {
    const token = cookies.get("token");
    const user = token ? await auth.verifyIdToken(token) : null;

    if (user) {
      throw redirect(302, "/dashboard");
    }
  } catch {
    // The token is set but invalid or expired
    cookies.set("token", "", { maxAge: -1 });
    throw redirect(307, "/login");
  }
}
