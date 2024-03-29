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

export async function POST({ request, url }: any) {
  try {
    const body = await request.json();

    const veryfyIdToken = await getAuth().verifyIdToken(
      request.headers.get("Authorization")!.split(" ")[1]
    );

    if (!veryfyIdToken) {
      return new Response("Unauthorized", { status: 401 });
    }

    const convertToStripePrice = (price: number) => {
      return price * 100;
    };

    // const applicationFee = () => {
    //   let fee = Math.ceil(
    //     convertToStripePrice(parseFloat(body.ticket.price) * 0.05) +
    //       Math.ceil(convertToStripePrice(parseFloat(body.ticket.price) * 0.029)) +
    //       30
    //   );
    //   if (fee < 50) {
    //     fee = 50;
    //   }
    //   return fee;
    // };

    const calculateTicketPrice = () => {
      return convertToStripePrice(parseFloat(body.ticket.price));
    };

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: calculateTicketPrice(),
            product_data: {
              name: body.ticket.name + " Admission",
              // party_name: body.party.name,
            },
            tax_behavior: "exclusive",
          },
          quantity: 1,
        },
      ],
      payment_intent_data: {
        application_fee_amount: Math.ceil(calculateTicketPrice() * 0.07),
        transfer_data: {
          destination: body.stripeAccountId,
        },
        metadata: {
          partyId: body.party.id,
          ticketId: body.ticket.id,
          ticketInfo: JSON.stringify(body.ticket),
          purchaserPhoneNumber: body.purchaserPhoneNumber,
        },
      },
      success_url:
        ENVIRONMENT === "development"
          ? `http://localhost:4242/order/sucess?session_id={CHECKOUT_SESSION_ID}`
          : `https://turnt.party/order/sucess?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:
        ENVIRONMENT === "development"
          ? `http://localhost:4242/${body.party.id}?status=canceled`
          : `https://turnt.party/${body.party.id}?status=canceled`,
      automatic_tax: {
        enabled: true,
      },
    });

    return new Response(JSON.stringify(checkoutSession));
  } catch (err) {
    throw new Error(String(err));
  }
}
