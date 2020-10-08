const admin = require('firebase-admin');
const functions = require('firebase-functions');
var express = require('express');
var app = express();
const cors = require('cors')({origin: true});
var http = require("https");
const stripe = require('stripe')('sk_test_51HCrlMASQcuvqq5qRoBALRqEj9NTsWPE8N9OPWvOJIcIe6klruWXlkh9l1Ly7K7CDKuHO80S7XVKF1A7Ex9qloQD00ZwSykRm0');
const zoomID = 'BAI2U_LMR0qde_D7g8SV_g'
const zoomSecret = 'vkU91bWzoulRS0hDnHxslr2a4JauqSol'
const zoomVerification = '8blv9hJ7SnatkgmG21B2Qw'
var btoa = require('btoa')

const vision = require('@google-cloud/vision').v1
const {Storage} = require('@google-cloud/storage');
const storage = new Storage();

let FieldValue = require('firebase-admin').firestore.FieldValue;

var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
     credential: admin.credential.cert(serviceAccount),
     databaseURL: "https://moveme-ad742.firebaseio.com"
     });

app.use(cors);
let db = admin.firestore();

// Google Vision API -----------------------------------------------------------------------------------
app.post('/app/visionAPI', async (req,res) =>{

  // Creates a client
  const client = new vision.ImageAnnotatorClient();

  const bucketName = "moveme-ad742.appspot.com"
  const fileName = 'SAT/'+req.body.uid
  // The folder to store the results
  const outputPrefix = 'SAT-JSON'

  const gcsSourceUri = `gs://${bucketName}/${fileName}`;
  const gcsDestinationUri = `gs://${bucketName}/${outputPrefix}/${req.body.uid}-`;

  const inputConfig = {
    // Supported mime_types are: 'application/pdf' and 'image/tiff'
    mimeType: 'application/pdf',
    gcsSource: {
      uri: gcsSourceUri,
    },
  };
  const outputConfig = {
    gcsDestination: {
      uri: gcsDestinationUri,
    },
  };
  const features = [{type: 'DOCUMENT_TEXT_DETECTION'}];
  const request = {
    requests: [
      {
        inputConfig: inputConfig,
        features: features,
        outputConfig: outputConfig,
      },
    ],
  };

  const [operation] = await client.asyncBatchAnnotateFiles(request);
  const [filesResponse] = await operation.promise();
  const destinationUri =
    filesResponse.responses[0].outputConfig.gcsDestination.uri;
  console.log('Json saved to: ' + destinationUri);

  //Save RFC, CURP and regimen
  const bucket = storage.bucket("moveme-ad742.appspot.com");
  const remoteFile = bucket.file('SAT-JSON/'+req.body.uid+'-output-1-to-2.json');

  let buffer = '';

  let auxRFC = '';
  let RFC = '';

  let auxCURP = '';
  let CURP = '';

  let auxReg = '';
  let Reg = '';

  remoteFile.createReadStream()
    .on('error', function(err) {console.log(err)})
    .on('data', function(response) {
      buffer += response
    })
    .on('end', function() {
      auxRFC += buffer.substring(buffer.lastIndexOf('RFC')+6,buffer.lastIndexOf('RFC')+100)
      RFC += auxRFC.substring(0,auxRFC.indexOf("\\n"))
      console.log(RFC);

      auxCURP += buffer.substring(buffer.lastIndexOf('CURP')+7,buffer.lastIndexOf('CURP')+100)
      CURP += auxCURP.substring(0,auxCURP.indexOf("\\n"))
      console.log(CURP);

      auxReg += buffer.substring(buffer.indexOf('Régimen')+9,buffer.indexOf('Régimen')+100)
      Reg += auxReg.substring(0,auxReg.indexOf("\\n"))
      console.log(Reg);

      db.collection("Instructors").doc(req.body.uid).set({
      RFC: RFC,
      CURP: CURP,
      regimen: Reg
      },{ merge: true })

  })
})
//Stripe API -------------------------------------------------------------------------------------------
app.post('/app/stripeAPI/delete-card',async (req,res) =>{
    stripe.paymentMethods.detach(
    req.body.paymentMethod,
  )
})

app.post('/app/stripeAPI/charge-card', async (req,res) =>{
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

app.post('/app/stripeAPI/refund', async (req,res) =>{

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

app.post('/app/stripeAPI/card-details',async (req,res) => {

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

app.post('/app/stripeAPI/secret', async (req, res) => {
  const intent = await stripe.paymentIntents.create({ // ... Fetch or create the PaymentIntent
      amount: req.body.amount,
      currency: 'mxn',
      // Verify your integration in this guide by including this parameter
      metadata: {integration_check: 'accept_a_payment'},
    });
  res.json({client_secret: intent.client_secret});
});

app.post('/app/stripeAPI/create-customer', async (req, res) => {
  // Create a new customer object
  const customer = await stripe.customers.create({
    email: req.body.email,
  });

  // save the customer.id as stripeCustomerId
  // in your database.

  res.send({ customer });
});

app.post('/app/stripeAPI/newPaymentMethod', async (req, res) => {
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

//Deauthorization --------------------------------------------------------------------------------------
app.post('/app/zoomAPI/deauthorization', (req, res, next) => {
  if (req.headers.authorization===zoomVerification) {

    if (req.body.payload.user_data_retention==='false') {
      let docRef=db.collection("Instructors").where("zoomUserID", "==", req.body.payload.user_id).where('zoomAccountID','==',req.body.payload.account_id)
      let deleteZoom = docRef.get()
          .then((snapshot) => {

            if (snapshot.empty) {
              console.log('No matching documents.');
              return;
            }else {

            snapshot.forEach((doc) => {
              console.log(doc.id, '=>', doc.data());
              doc.ref.update({
                zoomAccountID: FieldValue.delete(),
                zoomRefreshToken: FieldValue.delete(),
                zoomToken: FieldValue.delete(),
                zoomUserID: FieldValue.delete()
              })
            })
          }
          return 'ok'
          })
          .catch(error => {
              console.log("Error getting documents: ", error);
          });
    }


  var options = {
  "method": "POST",
  "hostname": "api.zoom.us",
  "port": null,
  "path": '/oauth/data/compliance',
  "headers": {
    "content-type": "application/json",
    "authorization": "Basic "+ btoa(zoomID+":"+zoomSecret)
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

    reqZoom.write(JSON.stringify({
    client_id: zoomID,
    user_id: req.body.payload.user_id,
    account_id: req.body.payload.account_id,
    deauthorization_event_received: {
      user_data_retention: req.body.payload.user_data_retention,
      account_id: req.body.payload.account_id,
      user_id: req.body.payload.user_id,
      signature: req.body.payload.signature,
      deauthorization_time: req.body.payload.deauthorization_time,
      client_id: zoomID
    },
    compliance_completed: true
  }));

  reqZoom.end();
}else {
  console.log('Wrong verification token')
}
  });

//Get User -----------------------------------------------------------------------
app.post('/app/zoomAPI/get-user', (req, res, next) => {
  console.log(req.body)

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

//Get Token -----------------------------------------------------------------------
  app.post('/app/zoomAPI/get-token', (req, res, next) => {

    var options = {
    "method": "POST",
    "hostname": "zoom.us",
    "port": null,
    "path": '/oauth/token?grant_type=authorization_code&code='+req.body.parsedcode+'&redirect_uri='+req.body.zoomRedirectURL,
    "headers": {
      "Authorization": "Basic "+ btoa(req.body.zoomID+':'+req.body.zoomSecret)
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

//Refresh Token -----------------------------------------------------------------------
  app.post('/app/zoomAPI/refresh-token', (req, res, next) => {

    var options = {
    "method": "POST",
    "hostname": "zoom.us",
    "port": null,
    "path": "/oauth/token?grant_type=refresh_token&refresh_token="+req.body.token,
    "headers": {
      "Authorization": "Basic "+ btoa(req.body.zoomID+':'+req.body.zoomSecret)
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

//CreateZoomMeeting -----------------------------------------------------------------------
app.post('/app/zoomAPI', (req, res, next) => {

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
app.post('/app/zoomAPI/getdata', (req, res, next) => {
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
app.post('/app/zoomAPI/delete', (req, res, next) => {
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
