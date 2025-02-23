import Stripe from "stripe";
import { PrismaClient } from "@prisma/client";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2020-08-27" });
const prisma = new PrismaClient();

/**
 * Creates a Stripe Checkout Session for purchasing credits.
 * Conversion rate: 1 USD = 100 credits (1 credit = 1 cent).
 */
const createCheckoutSession = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { creditsToBuy } = req.body;

    if (!creditsToBuy || creditsToBuy <= 0) {
      return res.status(400).json({ error: "Invalid credit quantity" });
    }

    // Calculate amount in cents. For example, if you charge 1 cent per credit:
    const amount = creditsToBuy; // creditsToBuy credits = creditsToBuy cents

    // Create a Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${creditsToBuy} Credits`,
            },
            unit_amount: amount, // amount is in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      // Replace these URLs with your actual success and cancel URLs
      success_url: `${process.env.API_BASE_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.API_BASE_URL}/payment/cancel`,
      metadata: {
        userId: userId.toString(),
        creditsToBuy: creditsToBuy.toString(),
      },
    });

    // Return the URL for the checkout session
    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error("Error creating Checkout session:", error);
    res.status(500).json({ error: error.message });
  }
};

export default { createCheckoutSession };
