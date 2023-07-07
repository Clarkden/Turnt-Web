import { auth } from "$lib/firebaseAdmin";
import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoadEvent } from "./$types";
import { doc, getDoc } from "firebase/firestore";
import { db } from "$lib/firebase";

export async function load({ cookies }: LayoutServerLoadEvent) {
  try {
    const token = cookies.get("token");
    const user = token ? await auth.verifyIdToken(token) : null;

    if (!user) {
      throw redirect(307, "/login");
    }

    const admin = await getDoc(doc(db, "admins", user.uid));


    if (!admin.exists()) {
      throw redirect(307, "/dashboard");
    }

    return {
      uid: user?.uid,
      admin: admin.exists(),
    };
  } catch {
    // The token is set but invalid or expired
    cookies.set("token", "", { maxAge: -1 });
    throw redirect(307, "/login");
  }
}
