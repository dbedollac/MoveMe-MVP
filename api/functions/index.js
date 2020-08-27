const functions = require('firebase-functions');

var express = require('express');
var app = express();
const cors = require('cors')({origin: true});
app.use(cors);
var http = require("https");
const stripe = require('stripe')('sk_test_51HCrlMASQcuvqq5qRoBALRqEj9NTsWPE8N9OPWvOJIcIe6klruWXlkh9l1Ly7K7CDKuHO80S7XVKF1A7Ex9qloQD00ZwSykRm0');

//Stripe API -------------------------------------------------------------------------------------------
app.post('/stripeAPI/delete-card',async (req,res) =>{
    stripe.paymentMethods.detach(
    req.body.paymentMethod,
  )
})

app.post('/stripeAPI/charge-card', async (req,res) =>{
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

app.post('/stripeAPI/refund', async (req,res) =>{

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

app.post('/stripeAPI/card-details',async (req,res) => {

  await stripe.paymentMethods.retrieve(
    req.body.paymentMethodId,
      (err, paymentMethod) => {
      if(err){console.log(err)}
      if (paymentMethod) {
        res.send(paymentMethod)
      }
    }
  )
})

app.post('/stripeAPI/secret', async (req, res) => {
  const intent = await stripe.paymentIntents.create({ // ... Fetch or create the PaymentIntent
      amount: req.body.amount,
      currency: 'mxn',
      // Verify your integration in this guide by including this parameter
      metadata: {integration_check: 'accept_a_payment'},
    });
  res.json({client_secret: intent.client_secret});
});

app.post('/stripeAPI/create-customer', async (req, res) => {
  // Create a new customer object
  const customer = await stripe.customers.create({
    email: req.body.email,
  });

  // save the customer.id as stripeCustomerId
  // in your database.

  res.send({ customer });
});

app.post('/stripeAPI/newPaymentMethod', async (req, res) => {
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
//Zoom API ---------------------------------------------------------------------------------------------

//Check Token ------------------------------------------------------------------------.
app.post('/zoomAPI/check-token', (req, res, next) => {
  var http = require("https");

    var options = {
      "method": "GET",
      "hostname": "api.zoom.us",
      "port": null,
      "path": "/v2/users/me",
      "headers": {
        "authorization": "Bearer "+req.body.token
      }
    };

    var reqZoom = http.request(options, (resZoom) => {
      var chunks = [];

      resZoom.on("data",  (chunk) => {
        chunks.push(chunk);
      });

      resZoom.on("end", () => {
        var body = Buffer.concat(chunks);
        console.log(body.toString());
        res.send(body.toString())
      });
    });

    reqZoom.end();
})

//Refresh Token -----------------------------------------------------------------------
  app.post('/zoomAPI/refresh-token', (req, res, next) => {
    console.log(req.body)

    var options = {
    "method": "POST",
    "hostname": "zoom.us/oauth",
    "port": null,
    "path": "/token?grant_type=refresh_token&refresh_token="+req.body.token,
    "headers": {
      "Authorization": "Basic "+ btoa(req.body.zoomID+':'+req.body.zoomSecret)
    }
    };

    var reqZoom = http.request(options, (resZoom) => {
      console.log(resZoom);
      var chunks = [];

      resZoom.on("data", (chunk) => {
        chunks.push(chunk);
      });

      resZoom.on("end", () => {
        var body = Buffer.concat(chunks);
        console.log(body.toString());
        res.send(body.toString())
      });
    });

    reqZoom.end();

    });

//CreateZoomMeeting -----------------------------------------------------------------------
app.post('/zoomAPI', (req, res, next) => {

var options = {
"method": "POST",
"hostname": "api.zoom.us",
"port": null,
"path": "/v2/users/me/meetings",
"headers": {
  "content-type": "application/json",
  "authorization": "Bearer "+req.body.token
}
};

var reqZoom = http.request(options, (resZoom) => {
  var chunks = [];

  resZoom.on("data", (chunk) => {
    chunks.push(chunk);
  });

  resZoom.on("end", () => {
    var body = Buffer.concat(chunks);
    console.log(body.toString());
    res.send(body.toString())
  });
});

reqZoom.write(JSON.stringify(
  req.body.settings
 ));

reqZoom.end();

});

// GetZoomMeeting Details------------------------------------------------------------------------
app.post('/zoomAPI/getdata', (req, res, next) => {
var http = require("https");

  var options = {
    "method": "GET",
    "hostname": "api.zoom.us",
    "port": null,
    "path": "/v2/meetings/"+req.body.meetingID,
    "headers": {
      "authorization": "Bearer "+req.body.token
    }
  };

  var reqZoom = http.request(options, (resZoom) => {
    var chunks = [];

    resZoom.on("data", (chunk) => {
      chunks.push(chunk);
    });

    resZoom.on("end", () => {
      var body = Buffer.concat(chunks);
      console.log(body.toString());
      res.send(body.toString())
    });
  });

  reqZoom.end();
});


// Delete Zoom Meeting------------------------------------------------------------------------
app.post('/zoomAPI/delete', (req, res, next) => {
var http = require("https");

var options = {
  "method": "DELETE",
  "hostname": "api.zoom.us",
  "port": null,
  "path": "/v2/meetings/"+req.body.meetingID+"?show_previous_occurrences=false",
  "headers": {
    "authorization": "Bearer "+req.body.token
  }
};

var reqZoom = http.request(options, (resZoom) => {
  var chunks = [];

  resZoom.on("data", (chunk) => {
    chunks.push(chunk);
  });

  resZoom.on("end", () => {
    var body = Buffer.concat(chunks);
    console.log(body.toString());
    res.send(body.toString())
  });
});

reqZoom.end();
});


exports.app = functions.https.onRequest(app)
