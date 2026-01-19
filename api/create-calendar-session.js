import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end("Method Not Allowed");
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",

      payment_method_types: ["card"], 
      invoice_creation: { enabled: true }, // FACTURE AUTO
      shipping_address_collection: {
        allowed_countries: ["CH"]
      },

      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: 500,
              currency: "chf",
            },
            display_name: "Livraison Suisse",
            delivery_estimate: {
              minimum: { unit: "business_day", value: 3 },
              maximum: { unit: "business_day", value: 7 },
            },
          },
        },
      ],

      line_items: [
        {
          price_data: {
            currency: "chf",
            unit_amount: 2900,
            product_data: {
              name: "Calendrier Leto 2026",
              description: "Calendrier officiel – 12 mois avec Leto 🐶",
            },
          },
          quantity: 1,
        },
      ],

      success_url: `${req.headers.origin}/boutique.html?success=true`,
      cancel_url: `${req.headers.origin}/boutique.html?canceled=true`,
    });

    res.status(200).json({ id: session.id });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Stripe error" });
  }
}
