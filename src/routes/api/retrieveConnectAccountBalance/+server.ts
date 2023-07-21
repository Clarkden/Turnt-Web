import axios from "axios";
// import { loadStripe } from "@stripe/stripe-js";
// const stripe = await loadStripe(process.env.PUBLIC_STRIPE_KEY!);
import { PRIVATE_STRIPE_KEY } from "$env/static/private";
import { ENVIRONMENT } from "$env/static/private";
import Stripe from "stripe";
import { getAuth } from "firebase-admin/auth";
const stripe = new Stripe(PRIVATE_STRIPE_KEY, {
  apiVersion: "2022-11-15",
});

export async function GET({ request, url }: any) {
  try {
    const id = url.searchParams.get("id");

    const veryfyIdToken = await getAuth().verifyIdToken(
      request.headers.get("Authorization")!.split(" ")[1]
    );

    if (!veryfyIdToken) {
      return new Response("Unauthorized", { status: 401 });
    }

    const account = await stripe.balance.retrieve({
      stripeAccount: id,
    });

    return new Response(JSON.stringify(account));
  } catch (err) {
    throw new Error(String(err));
  }
}
