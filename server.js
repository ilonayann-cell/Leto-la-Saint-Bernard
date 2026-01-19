const express = require("express");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const app = express();
app.use(express.json());
app.use(express.static("public"));

app.post("/create-checkout-session", async (req, res) => {
  const { nom, email, date, heure } = req.body;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card", "twint"],
    mode: "payment",
    customer_email: email,
    line_items: [{
      price_data: {
        currency: "chf",
        product_data: { name: "Balade avec Leto – 30 minutes" },
        unit_amount: 5000
      },
      quantity: 1
    }],
    metadata: {
      nom,
      date,
      heure,
      decharge: "Balade effectuée sous la responsabilité du client."
    },
    success_url: `${process.env.BASE_URL}/success.html`,
    cancel_url: `${process.env.BASE_URL}/reservation.html`
  });

  res.json({ id: session.id });
});

module.exports = app;
