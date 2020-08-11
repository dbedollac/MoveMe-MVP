import React,{useState,useContext, useEffect} from 'react'
import {CardElement, useStripe, useElements} from '@stripe/react-stripe-js';
import {proxyurl} from '../../Config/proxyURL'
import Errores from '../Atoms/Errores'
import { Spinner} from 'react-bootstrap'
import {CheckCircleFill} from 'react-bootstrap-icons'
import {db} from '../../Config/firestore'
import { Auth } from "../../Config/AuthContext";
import CreditCardDetails from '../Cards/CreditCardDetails'
import './PaymentForm.css'

const PaymentForm = (props) => {
  const { usuario } = useContext(Auth);
  const stripe = useStripe();
  const elements = useElements();
  const [name,setName] = useState('')
  const amount = Number(props.total*100).toFixed(0)
  const [error,setError] = useState(null)
  const [loading,setLoading] = useState(false)
  const [success,setSuccess] =  useState(false)
  const [details,setDetails] = useState(null)
  const [stripeID,setstripeID] = useState(null)
  const [paymentMethod,setpaymentMethod] = useState(null)
  const [otherCard,setotherCard] = useState(false)

  const deletePaymentMethod = () =>{
    fetch(proxyurl+'stripeAPI/delete-card', {
      method: 'post',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        paymentMethod: paymentMethod
      }),
    }).then(console.log('Tarjeta eliminiada')).catch(error=>console.log(error))
  }

  const createPaymentMethod = (customerId,paymentMethodId) =>{
    return (
    fetch(proxyurl+'stripeAPI/newPaymentMethod', {
      method: 'post',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        customerId: customerId,
        paymentMethodId: paymentMethodId
      }),
    })
      .then((result) => {
        if (result.error) {
          // The card had an error when trying to attach it to a customer.
          setError(result.error.message)
          setLoading(false)
          throw result;
        }
        return result;
      })
      // Normalize the result to contain the object returned by Stripe.
      // Add the additional details we need.
      .then((result) => {
        console.log(result)
        setSuccess(true)
        setLoading(false)
        db.collection('Users').doc(usuario.uid).set({
          paymentMethod: paymentMethodId
        },{merge:true})
      })
    )
  }

  const handlePaymentMethod = async (event) =>{

    if (otherCard) {
      event.preventDefault()
      deletePaymentMethod()
    }
    setLoading(true)

    const cardElement = elements.getElement(CardElement);

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
      billing_details: {
        name: name,
        email: usuario.email
      }
    });

    const customerId = await db.collection('Users').doc(usuario.uid).get().then((doc) => {
      return doc.data().stripeCustomerID
    }).catch(error => console.log(error))

    if (error) {
      console.log('[createPaymentMethod error]', error);
      setError(error.message)
      setLoading(false)
    }else {

      console.log('[PaymentMethod]', paymentMethod);
      console.log('[customerId]', customerId);
      const paymentMethodId = paymentMethod.id
      createPaymentMethod(customerId, paymentMethodId )
    }
  }

  const handleName = (event) =>{
    setName(event.target.value)
  }

  const handleSubmit = async (event) => {
    // Block native form submission.
    event.preventDefault();
    setLoading(true)

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
              email: usuario.email
            }
          }
        });

        if (result.error) {
      // Show error to your customer (e.g., insufficient funds)
            console.log(result.error.message);
            setError(result.error.message)
            setLoading(false)
            setSuccess(false)
          } else {
            // The payment has been processed!
            console.log(result.paymentIntent.status)
            if (result.paymentIntent.status === 'succeeded') {
              setSuccess(true)
              setLoading(false)
              if (details===null) {
                handlePaymentMethod()
              }
              setError(null)
                            // Show a success message to your customer
              // There's a risk of the customer closing the window before callback
              // execution. Set up a webhook or plugin to listen for the
              // payment_intent.succeeded event that handles any business critical
              // post-payment actions.
            }
          }
      });
  }

  const handleSubmitAuto = (event) =>{
    event.preventDefault();
    setLoading(true)

    var response = fetch(proxyurl+'stripeAPI/charge-card',{
      method: 'POST',
      body: JSON.stringify({
        amount: amount,
        customer: stripeID,
        payment_method: paymentMethod
      }),
      headers: {
        "content-type": "application/json"
      }
    }).then(function(result) {
        Promise.resolve(result.text()).then((resp) =>{
          if (resp === 'error') {
              setError('¡Algo salió mal! Intenta con otra tarjeta')
              setLoading(false)
              setSuccess(false)
            } else {
              setSuccess(true)
              setLoading(false)
              setError(null)
            }
        })
      })
  }

  const getDetails = (paymentMethod) =>{
    return (
    fetch(proxyurl+'stripeAPI/card-details', {
      method: 'post',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        paymentMethodId: paymentMethod
      }),
    })
      .then((result) => {
        Promise.resolve(result.json()).then((resp) =>{
          setDetails(resp)
        })
        if (result.error) {
          // The card had an error when trying to attach it to a customer.
          console.log(result.error.message)
          throw result;
        }
        return result;
      })
    )
  }

  useEffect(()=>{
    if (usuario) {
      db.collection('Users').doc(usuario.uid).get().then(doc=>{
        if (doc.data().paymentMethod) {
            setstripeID(doc.data().stripeCustomerID)
            getDetails(doc.data().paymentMethod)
            setpaymentMethod(doc.data().paymentMethod)
        }
      }
      ).catch(error => console.log(error))
    }
  },[usuario])


  if (details&&!otherCard) {
    return (
      <form onSubmit={handleSubmitAuto}>
          <CreditCardDetails details={details} />
          <Errores mensaje={error} />
          <div className='d-flex flex-column align-items-center'>
            {loading?<Spinner animation="border" />
            :success?<CheckCircleFill color='green' size={'2em'}/>:
            <button type="submit" className='btn-success col-10 rounded' disabled={!stripe||(props.total<=10)}>
              Pagar
            </button>}
          </div>
          {<i className='mt-5' style={{cursor:'pointer'}} onClick={()=>{setotherCard(true)}}>Usar otra tarjeta</i>}
      </form>
    )
  }

  return (
    <form onSubmit={handleSubmit}>
        <input type='text' placeholder='Nombre en la tarjeta' onChange={handleName} className='col-12 rounded' required/>
        <CardElement />
        <Errores mensaje={error} />
        <div className='d-flex flex-column align-items-center'>
          {loading?<Spinner animation="border" />
          :success?<CheckCircleFill color='green' size={'2em'}/>:
          <button type="submit" className='btn-success col-10 rounded' disabled={!stripe||(props.total<=10)}>
            Pagar
          </button>}
        </div>
        {success&&otherCard?<button className='btn-info' onClick={handlePaymentMethod}>Guardar tarjeta</button>:null}
    </form>
  )
}

export default PaymentForm
