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
  arrayRemove,
  updateDoc,
} from "firebase/firestore";
import {
  ENVIRONMENT,
  PRIVATE_TWILIO_AUTH_TOKEN,
  PRIVATE_TWILIO_ACCOUNT_SID,
} from "$env/static/private";
import Stripe from "stripe";
const stripe = new Stripe(PRIVATE_STRIPE_KEY, {
  apiVersion: "2022-11-15",
});

import twilio from "twilio";

const client = twilio(PRIVATE_TWILIO_ACCOUNT_SID, PRIVATE_TWILIO_AUTH_TOKEN);

export async function POST({ request }: any) {
  const body = await request.json();

  console.log(body);

  try {
    const party = await getDoc(doc(db, "parties", body.partyId));

    if (
      party.exists() &&
      party.data().paidParty &&
      party.data().attendies > 0
    ) {
      const allTicketPurchases = await getDocs(
        query(
          collection(db, "payments"),
          where("metadata.partyId", "==", body.partyId)
        )
      );

      try {
        allTicketPurchases.forEach((document) => {
          const refund = stripe.refunds
            .create(
              {
                payment_intent: document.id,
                // refund_application_fee: false,
                reverse_transfer: true,
              },
              {
                stripeAccount: body.stripeAccountId,
              }
            )
            .then(() => {
              client.messages
                .create({
                  body: "A party you purchased tickets for has been cancelled. You have been refunded and will see the funds in your account within 5-10 business days.",
                  from: "+18663958046",
                  to: `+1${document.data().metadata.purchaserPhoneNumber}`,
                })
                .then((message: any) => console.log(message.sid));

              deleteDoc(doc(db, "payments", document.id));
            });
          console.log("Refunded: ", document.id);
        });
      } catch (err) {
        console.log(err);
      }

      const deleteParty = await deleteDoc(doc(db, "parties", body.partyId));
      const deleteHostParty = await updateDoc(
        doc(db, "hosts", body.hostAccountId),
        {
          parties: arrayRemove(body.partyId),
        }
      );
    }
    return new Response(
      JSON.stringify({ message: "Party deleted successfully" })
    );
  } catch (err) {
    throw new Error(String(err));
  }
}
