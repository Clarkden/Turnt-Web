import {
  PRIVATE_STRIPE_KEY,
  PRIVATE_ENDPOINT_SECRET,
  PRIVATE_TWILIO_AUTH_TOKEN,
  PRIVATE_TWILIO_ACCOUNT_SID,
  ENVIRONMENT,
} from "$env/static/private";
import Stripe from "stripe";
import type { RequestEvent } from "./$types";
const stripe = new Stripe(PRIVATE_STRIPE_KEY, {
  apiVersion: "2022-11-15",
});
import { db } from "../../lib/firebase";
import {
  getDoc,
  doc,
  setDoc,
  collection,
  addDoc,
  increment,
  updateDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import twilio from "twilio";

const client = twilio(PRIVATE_TWILIO_ACCOUNT_SID, PRIVATE_TWILIO_AUTH_TOKEN);

const endpointSecret = PRIVATE_ENDPOINT_SECRET;

export async function POST({ request }: RequestEvent) {
  // console.log("webook");
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
      try {
        const paymentIntentSucceeded = event.data.object;

        const updatePartyAttendiesCount = await updateDoc(
          doc(db, "parties", paymentIntentSucceeded.metadata.partyId),
          {
            attendies: increment(1),
          }
        );

        const party = await getDoc(
          doc(db, "parties", paymentIntentSucceeded.metadata.partyId)
        );

        if (party.exists()) {
          const tickets = JSON.parse(party.data().tickets);

          // console.log("tickets:", tickets, typeof tickets)

          // Get the index of the purchasedTicket
          // console.log("metadata ticket", paymentIntentSucceeded.metadata.ticketId)
          let ticketIndex = tickets.findIndex(
            (ticket: any) =>
              parseInt(ticket.id) ===
              parseInt(paymentIntentSucceeded.metadata.ticketId)
          );

          if (ticketIndex > -1 && tickets[ticketIndex].quantity > 0) {
            // Decrement the quantity directly in the tickets array
            // console.log("tickets1", tickets)

            tickets[ticketIndex].quantity -= 1;

            // console.log("tickets2", tickets)

            const updatePartyTickets = await updateDoc(
              doc(db, "parties", paymentIntentSucceeded.metadata.partyId),
              {
                tickets: JSON.stringify(tickets),
              }
            );
          }
        }
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

        const updateHostAttendiesCount = await query(
          collection(db, "hosts"),
          where(
            "parties",
            "array-contains",
            paymentIntentSucceeded.metadata.partyId
          )
        );

        const querySnapshot = await getDocs(updateHostAttendiesCount);
        querySnapshot.forEach(async (document) => {
          const hostDoc = doc(db, "hosts", document.id);
          await updateDoc(hostDoc, { attendees: increment(1) });
        });

        const ticket = await addDoc(collection(db, "tickets"), {
          paymentIntentId: paymentIntentSucceeded.id,
          purchaserPhoneNumber:
            paymentIntentSucceeded.metadata.purchaserPhoneNumber,
          partyId: paymentIntentSucceeded.metadata.partyId,
          ticketCreated: Date.now(),
          ticketInfo: paymentIntentSucceeded.metadata.ticketInfo,
        });


        client.messages
          .create({
            // body: `Your link to your ticket is below 🎉:\n${
            //   ENVIRONMENT === "development"
            //     ? `http://localhost:4242/qrCode/${paymentIntentSucceeded.id}`
            //     : `https://turnt.party/qrCode/${paymentIntentSucceeded.id}`
            // }`,
            body: `Turnt - Here is your ticket Qr Code: turnt.party/qrCode/${paymentIntentSucceeded.id}`,
            from: "+18663958046",
            to: `${paymentIntentSucceeded.metadata.purchaserPhoneNumber}`,
          })
          .then((message: any) => console.log(message.sid));
      } catch (err) {
        console.log(err);
      }
      break;
    // ... handle other event types
    default:
    //   console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  return new Response();
}
