import axios from "axios";
// import { loadStripe } from "@stripe/stripe-js";
// const stripe = await loadStripe(process.env.PUBLIC_STRIPE_KEY!);
import { PRIVATE_STRIPE_KEY } from "$env/static/private";
import { getAuth } from "firebase-admin/auth";
import Stripe from "stripe";
const stripe = new Stripe(PRIVATE_STRIPE_KEY, {
  apiVersion: "2022-11-15",
});

export async function GET({request, url }: any) {
  try {

  const veryfyIdToken = await getAuth().verifyIdToken(
    request.headers.get("Authorization")!.split(" ")[1]
  );

  if (!veryfyIdToken) {
    return new Response("Unauthorized", { status: 401 });
  }
    const id = url.searchParams.get("id");

    let account: any;
    try {
      const foundAccount = await stripe.accounts.retrieve(id);
      account = foundAccount;
    } catch (err) {
      throw new Error(String(err));
    }

    return new Response(JSON.stringify(account));
  } catch (err) {
    throw new Error(String(err));
  }
}
