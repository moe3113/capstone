// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const stripe = require('stripe')("sk_test_51NJwzHCdB1SDHMEBWu6PgNGwbhIgfraJts571PpZEVMLYSTR6pJOBEmsA4MxRmTAvMEjXyIeotTAiDsfUdzgeHEc00vUxjPSlI");

async function CreateStripeSession(req, res) {
  const  data= JSON.parse(req.body);
  const {totalPrice} = data;
    const redirectURL =
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000'
      : process.env.LIVE_URL;

  const transformedItem = {
    price_data: {
      currency: 'usd',
      product_data: {
        images: ["https://i.imgur.com/tPJJzSO.png"],
        name: "pics",
      },
      unit_amount: Number(totalPrice) * 100,
    },
    // description: item.description,
    quantity: 1,
  };

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [transformedItem],
    mode: 'payment',
    success_url: redirectURL + '/',
    cancel_url: redirectURL + '/',
  });
  res.json({ id: session.id });
}

export default CreateStripeSession;