import axios from "axios";
// import { loadStripe } from "@stripe/stripe-js";
// const stripe = await loadStripe(process.env.PUBLIC_STRIPE_KEY!);
import { PRIVATE_STRIPE_KEY } from "$env/static/private";
import { ENVIRONMENT } from "$env/static/private";
import Stripe from "stripe";
const stripe = new Stripe(PRIVATE_STRIPE_KEY, {
  apiVersion: "2022-11-15",
});

export async function GET({ url }: any) {
  const id = url.searchParams.get("id");

  try {
    const account = await stripe.balance.retrieve({
      stripeAccount: id,
    });

    return new Response(JSON.stringify(account));
  } catch (err) {
    throw new Error(String(err));
  }
}
