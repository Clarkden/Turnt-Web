import axios from "axios";
// import { loadStripe } from "@stripe/stripe-js";
// const stripe = await loadStripe(process.env.PUBLIC_STRIPE_KEY!);
import { PRIVATE_STRIPE_KEY } from "$env/static/private";
import { db } from "../../../lib/firebase";
import {
  doc,
  getDocs,
  getDoc,
  collection,
  query,
  where,
  deleteDoc,
} from "firebase/firestore";
import { ENVIRONMENT } from "$env/static/private";
import Stripe from "stripe";
const stripe = new Stripe(PRIVATE_STRIPE_KEY, {
  apiVersion: "2022-11-15",
});

export async function POST({ request }: any) {
  const body = await request.json();

  try {
    const allTicketPurchases = await getDocs(
      query(
        collection(db, "payments"),
        where("metadata.partyId", "==", body.partyId)
      )
    );

    console.log(allTicketPurchases);

    allTicketPurchases.forEach((document) => {
      const refund = stripe.refunds
        .create(
          {
            payment_intent: document.id,
          },
          {
            stripeAccount: body.stripeAccountId,
          }
        )
        .then(() => {
          // Alert each user that the party has been cancelled

          deleteDoc(doc(db, "payments", document.id));
        });
      console.log("Refunded: ", document.id);
    });

    const deleteParty = await deleteDoc(doc(db, "parties", body.partyId));

    return new Response(
      JSON.stringify({ message: "Party deleted successfully" })
    );
  } catch (err) {
    throw new Error(String(err));
  }
}
