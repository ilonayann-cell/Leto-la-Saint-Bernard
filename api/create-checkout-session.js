import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { nom, email, date, heure } = req.body;

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "chf",
              product_data: {
                name: `Balade avec Leto – ${date} ${heure}`,
                description: "Balade canine avec Leto, Saint-Bernard à Genève",
              },
              unit_amount: 3900,
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${req.headers.origin}/reservation.html?success=true`,
        cancel_url: `${req.headers.origin}/reservation.html?canceled=true`,
        customer_email: email,
        metadata: { nom, date, heure },
      });

      res.status(200).json({ id: session.id });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erreur lors de la création de la session Stripe." });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Méthode non autorisée");
  }
}
