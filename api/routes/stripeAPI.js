var express = require('express');
var router = express.Router();
var http = require("https");
const stripe = require('stripe')('sk_test_51HCrlMASQcuvqq5qRoBALRqEj9NTsWPE8N9OPWvOJIcIe6klruWXlkh9l1Ly7K7CDKuHO80S7XVKF1A7Ex9qloQD00ZwSykRm0');

router.post('/delete-card',async (req,res) =>{
    stripe.paymentMethods.detach(
    req.body.paymentMethod,
  )
})

router.post('/charge-card', async (req,res) =>{
  const paymentIntent = await stripe.paymentIntents.create({
    amount: req.body.amount,
    currency: "mxn",
    customer: req.body.customer,
    payment_method: req.body.payment_method,
    off_session: true,
    confirm: true
  }).catch((error)=>{
    res.send({error:'error'});
  })

  if (paymentIntent.status === "succeeded") {
    res.send(paymentIntent);
  }
})

router.post('/refund', async (req,res) =>{

  const refund = await stripe.refunds.create({
    payment_intent: req.body.paymentID,
    amount: req.body.paymentAmount
  }).catch((error)=>{
    res.send({error:error});
  })

  if (refund.status === "succeeded") {
    res.send(refund)
  }

})

router.post('/card-details',async (req,res) => {

  await stripe.paymentMethods.retrieve(
    req.body.paymentMethodId,
    function(err, paymentMethod) {
      if(err){console.log(err)}
      if (paymentMethod) {
        res.send(paymentMethod)
      }
    }
  )
})

router.post('/secret', async (req, res) => {
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

router.post('/newPaymentMethod', async (req, res) => {
  // Attach the payment method to the customer
  try {
    await stripe.paymentMethods.attach(req.body.paymentMethodId, {
      customer: req.body.customerId,
    });
  } catch (error) {
    return res.status('402').send({ error: { message: error.message } });
  }


  res.send('succeeded');
});

module.exports = router;
