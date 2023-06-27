import axios from "axios";
// import { loadStripe } from "@stripe/stripe-js";
// const stripe = await loadStripe(process.env.PUBLIC_STRIPE_KEY!);
import { PRIVATE_STRIPE_KEY } from "$env/static/private";
import { ENVIRONMENT } from "$env/static/private";
import Stripe from "stripe";
const stripe = new Stripe(PRIVATE_STRIPE_KEY, {
  apiVersion: "2022-11-15",
});

const convertToStripePrice = (price: number) => {
  return price * 100;
};

export async function POST({ request, url }: any) {
  const body = await request.json();
  console.log(body)

  try {
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: convertToStripePrice(parseInt(body.ticket.price)),
            product_data: {
              name: body.ticket.name + " Admission",
              // party_name: body.party.name,
            },
          },
          quantity: 1,
        },
      ],
      payment_intent_data: {
        application_fee_amount: 30,
        transfer_data: {
          destination: body.stripeAccountId,
        },
        metadata: {
          partyId: body.party.id,
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
