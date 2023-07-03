import axios from "axios";
// import { loadStripe } from "@stripe/stripe-js";
// const stripe = await loadStripe(process.env.PUBLIC_STRIPE_KEY!);
import { PRIVATE_STRIPE_KEY } from "$env/static/private";
import { ENVIRONMENT } from "$env/static/private";
import Stripe from "stripe";
const stripe = new Stripe(PRIVATE_STRIPE_KEY, {
  apiVersion: "2022-11-15",
});

export async function POST(event) {
  try {
    const body = await event.request.json();

    const accountLink = await stripe.accountLinks.create({
      account: body.id,
      refresh_url:
        ENVIRONMENT === "development"
          ? "http://localhost:4242/hub/dashboard/account/refreshLink"
          : "https//turnt.party/hub/dashboard/account/refreshLink",
      return_url:
        ENVIRONMENT === "development"
          ? "http://localhost:4242/hub/dashboard/account"
          : "https//turnt.party/hub/dashboard/account",
      type: "account_onboarding",
    });

    


    return new Response(JSON.stringify(accountLink));
  } catch (err) {
    throw new Error(String(err));
  }
}
