import axios from "axios";
// import { loadStripe } from "@stripe/stripe-js";
// const stripe = await loadStripe(process.env.PUBLIC_STRIPE_KEY!);
import { PRIVATE_STRIPE_KEY } from "$env/static/private";
import { ENVIRONMENT } from "$env/static/private";
import { getAuth } from "firebase-admin/auth";
import Stripe from "stripe";
const stripe = new Stripe(PRIVATE_STRIPE_KEY, {
  apiVersion: "2022-11-15",
});

export async function POST(event: any) {
  try {

  const veryfyIdToken = await getAuth().verifyIdToken(
    event.request.headers.get("Authorization")!.split(" ")[1]
  );

  if (!veryfyIdToken) {
    return new Response("Unauthorized", { status: 401 });
  }
    const body = await event.request.json();

    // getAuth()
    //   .verifyIdToken(body.token)
    //   .then(async (decodedToken) => {
    const accountLink = await stripe.accountLinks.create({
      account: body.id,
      refresh_url:
        ENVIRONMENT === "development"
          ? "http://localhost:4242/dashboard/account/refreshLink"
          : "https://www.turnt.party/dashboard/account/refreshLink",
      return_url:
        ENVIRONMENT === "development"
          ? "http://localhost:4242/dashboard/account"
          : "https://www.turnt.party/dashboard/account",
      type: "account_onboarding",
    });

    return new Response(JSON.stringify(accountLink));
    // })
    // .catch((error) => {
    //   console.error(error);
    //   return new Response(JSON.stringify(error));
    // });
  } catch (err) {
    throw new Error(String(err));
  }
}
