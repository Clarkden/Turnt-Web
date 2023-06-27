import { PRIVATE_STRIPE_KEY } from "$env/static/private";
import Stripe from "stripe";
import type { RequestEvent } from "./$types";
const stripe = new Stripe(PRIVATE_STRIPE_KEY, {
  apiVersion: "2022-11-15",
});
import { db } from "../../lib/firebase";
import { getDoc, doc, setDoc, collection, addDoc } from "firebase/firestore";

const endpointSecret =
  "whsec_2d22e025a787b3de3b830227fa5e75e899cee958c648d2b10ad9073ed9eee9f7";

export async function POST({ request }: RequestEvent) {
  const sig = (await request.headers.get("stripe-signature")) as string;
  const body = await request.text();

  let event: any;
  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err: any) {
    throw new Error(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case "payment_intent.succeeded":
      const paymentIntentSucceeded = event.data.object;

      const paymentReceipt = await setDoc(
        doc(db, "payments", paymentIntentSucceeded.id),
        {
          amount: paymentIntentSucceeded.amount,
          created: paymentIntentSucceeded.created,
          currency: paymentIntentSucceeded.currency,
          customer: paymentIntentSucceeded.customer,
          id: paymentIntentSucceeded.id,
          metadata: paymentIntentSucceeded.metadata,
        }
      );

      console.log(paymentIntentSucceeded);

      const ticket = await addDoc(collection(db, "tickets"), {
        paymentIntentId: paymentIntentSucceeded.id,
        purchaserPhoneNumber:
          paymentIntentSucceeded.metadata.purchaserPhoneNumber,
        partyId: paymentIntentSucceeded.metadata.partyId,
        ticketCreated: Date.now(),
      });
      // Then define and call a function to handle the event payment_intent.succeeded
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  return new Response();
}
