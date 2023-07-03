import axios from "axios";
// import { loadStripe } from "@stripe/stripe-js";
// const stripe = await loadStripe(process.env.PUBLIC_STRIPE_KEY!);
import { PRIVATE_STRIPE_KEY } from "$env/static/private";
import { ENVIRONMENT } from "$env/static/private";
import Stripe from "stripe";
const stripe = new Stripe(PRIVATE_STRIPE_KEY, {
  apiVersion: "2022-11-15",
});

export async function POST({ request }: any) {
  const body = await request.json();

  try {
    const transactions = await stripe.balanceTransactions.list({
      limit: 10,
    }, {
        stripeAccount: body.stripeAccountId,
    });

    return new Response(JSON.stringify(transactions));
  } catch (err) {
    throw new Error(String(err));
  }
}
