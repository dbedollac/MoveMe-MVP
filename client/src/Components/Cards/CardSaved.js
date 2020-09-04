import React,{useState,useContext, useEffect} from 'react'
import {CardElement, useStripe, useElements} from '@stripe/react-stripe-js';
import { Auth } from "../../Config/AuthContext"
import CreditCardDetails from '../Cards/CreditCardDetails'
import {db} from '../../Config/firestore'
import {proxyurl} from '../../Config/proxyURL'
import {TrashFill, PencilSquare, CheckCircleFill, ChevronCompactDown, ChevronCompactUp} from 'react-bootstrap-icons'
import { Spinner, Modal, Button} from 'react-bootstrap'
import Errores from '../Atoms/Errores'
import * as firebase from "firebase/app";
import { useTranslation } from 'react-i18next';

const CardSaved = (props) => {
  const { usuario } = useContext(Auth);
  const stripe = useStripe();
  const elements = useElements();
  const [details,setDetails] = useState(null)
  const [show, setShow] = useState(false);
  const [showLogin,setshowLogin] = useState(false)
  const [loading,setLoading] = useState(false)
  const [error,setError] = useState(null)
  const [success,setSuccess] =  useState(false)
  const [name,setName] = useState('')
  const [paymentMethod,setpaymentMethod] = useState(null)
  const [showDelete,setShowDelete] = useState(false)
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  const handleClose = () => setShow(false);
  const handleCloseDelete = () => setShowDelete(false);

  const deleteCard = async () =>{
    setLoading(true)
    await deletePaymentMethod()
    await db.collection('Users').doc(usuario.uid).update({
      paymentMethod: firebase.firestore.FieldValue.delete()
    })

    window.location.reload(false)
  }

  const handleName = (event) =>{
    setName(event.target.value)
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
      .then(async (result) => {
        setSuccess(true)
        setLoading(false)
        await db.collection('Users').doc(usuario.uid).set({
          paymentMethod: paymentMethodId
        },{merge:true})
        window.location.reload(false)
      })
    )
  }


  const handlePaymentMethod = async (event) =>{
    event.preventDefault()

    deletePaymentMethod()
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

  useEffect(()=>{
    if (usuario) {
      db.collection('Users').doc(usuario.uid).get().then(doc=>{
        if (doc.data().paymentMethod) {
            getDetails(doc.data().paymentMethod)
            setpaymentMethod(doc.data().paymentMethod)
        }
      }
      ).catch(error => console.log(error))
    }
  },[usuario])

  return(
    <div>
      <h5>{t('misCompras.2','Método de pago predeterminado')}</h5>
      <div className='d-flex flex-column flex-lg-row align-items-center justify-content-around'>
        {details?<CreditCardDetails details={details} />:<h5 style={{color:'gray'}} className='text-center py-5'><i>{t('misCompras.3','No hay ningún método guardado')}</i></h5>}
        <div className='d-flex flex-row align-items-center justify-content-between col-12 col-lg-2'>
          <PencilSquare size={'30px'} style={{cursor:'pointer'}} onClick={()=>{setShow(true)}}/>
          <TrashFill size={'30px'} style={{cursor:'pointer'}} onClick={()=>{setShowDelete(true)}}/>
        </div>
      </div>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Body>
          <form onSubmit={handlePaymentMethod}>
              <input type='text' placeholder={t('misCompras.4','Nombre en la tarjeta')} onChange={handleName} className='col-12 rounded' required/>
              <CardElement />
              <Errores mensaje={error} />
              <div className='d-flex flex-column align-items-center'>
                {loading?<Spinner animation="border" />
                :success?<CheckCircleFill color='green' size={'2em'}/>:
                <button type="submit" className='btn-info col-10 rounded'>
                  {t('misCompras.5','Guardar tarjeta')}
                </button>}
              </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            {t('misCompras.6','Cancelar')}
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showDelete}
        onHide={handleCloseDelete}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>{t('misCompras.7','Eliminar método de pago predeterminado')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {t('misCompras.8','¿Deseas borrar tu método de pago predeterminado? Tendrás que volver a ingresar los datos de una tarjeta en tu próxima compra.')}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDelete}>
            {t('misCompras.6','Cancelar')}
          </Button>
          <Button variant="danger" onClick={deleteCard}>{loading?<Spinner animation="border" />:'Borrar'}</Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default CardSaved
