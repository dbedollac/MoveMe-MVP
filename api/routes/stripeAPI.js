var express = require('express');
var router = express.Router();
var http = require("https");
const stripe = require('stripe')('sk_test_51HCrlMASQcuvqq5qRoBALRqEj9NTsWPE8N9OPWvOJIcIe6klruWXlkh9l1Ly7K7CDKuHO80S7XVKF1A7Ex9qloQD00ZwSykRm0');

router.post('/secret', async (req, res) => {
  console.log(req.body.amount)
  const intent = await stripe.paymentIntents.create({ // ... Fetch or create the PaymentIntent
      amount: req.body.amount,
      currency: 'mxn',
      // Verify your integration in this guide by including this parameter
      metadata: {integration_check: 'accept_a_payment'},
    });
  res.json({client_secret: intent.client_secret});
});

router.post('/create-customer', async (req, res) => {
  // Create a new customer object
  const customer = await stripe.customers.create({
    email: req.body.email,
  });

  // save the customer.id as stripeCustomerId
  // in your database.

  res.send({ customer });
});

module.exports = router;
