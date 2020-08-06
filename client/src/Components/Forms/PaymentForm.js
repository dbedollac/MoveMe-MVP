import React,{useState} from 'react'
import {CardElement, useStripe, useElements} from '@stripe/react-stripe-js';
import {proxyurl} from '../../Config/proxyURL'
import Errores from '../Atoms/Errores'
import { Spinner} from 'react-bootstrap'
import {CheckCircleFill} from 'react-bootstrap-icons'
import './PaymentForm.css'

const PaymentForm = (props) => {
  const stripe = useStripe();
  const elements = useElements();
  const [name,setName] = useState('')
  const amount = Number(props.total*100).toFixed(0)
  const [error,setError] = useState(null)
  const [loading,setLoading] = useState(false)
  const [success,setSuccess] =  useState(false)

  const handleName = (event) =>{
    setName(event.target.value)
  }

  const handleSubmit = async (event) => {
    // Block native form submission.
    event.preventDefault();
    setLoading(true)

    if (!stripe || !elements) {

      return;
    }

    var response = fetch(proxyurl+'stripeAPI/secret',{
      method: 'POST',
      body: JSON.stringify({
        amount: amount
      }),
      headers: {
        "content-type": "application/json"
      }
    }).then(function(response) {
        return response.json();
      }).then(async function(responseJson) {
        var clientSecret = responseJson.client_secret;
        // Call stripe.confirmCardPayment() with the client secret.
        const result = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
              name: name,
            },
          }
        });

        if (result.error) {
      // Show error to your customer (e.g., insufficient funds)
            console.log(result.error.message);
            setError(result.error.message)
            setLoading(false)
          } else {
            // The payment has been processed!
            console.log(result.paymentIntent.status)
            if (result.paymentIntent.status === 'succeeded') {
              setSuccess(true)
                            // Show a success message to your customer
              // There's a risk of the customer closing the window before callback
              // execution. Set up a webhook or plugin to listen for the
              // payment_intent.succeeded event that handles any business critical
              // post-payment actions.
            }
          }
      });
  };

  return (
    <form onSubmit={handleSubmit}>
        <input type='text' placeholder='Nombre en la tarjeta' onChange={handleName} className='col-12 rounded' required/>
        <CardElement />
        <Errores mensaje={error} />
        <div className='d-flex flex-column align-items-center'>
          {success?<CheckCircleFill color='green' size={'2em'}/>
          :loading?<Spinner animation="border" />:
          <button type="submit" disabled={!stripe} className='btn-success col-10 rounded' disabled={(props.total<=10)}>
            Pagar
          </button>}
        </div>
    </form>
  );
};

export default PaymentForm
