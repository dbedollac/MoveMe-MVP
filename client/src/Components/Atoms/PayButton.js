import React,{useState,useContext} from 'react'
import {Modal, Button} from 'react-bootstrap'
import { CheckSquare } from 'react-bootstrap-icons';
import StripeFee from '../Atoms/StripeFee'
import PaymentForm from '../Forms/PaymentForm'
import Signup from '../Forms/Signup'
import { Auth } from "../../Config/AuthContext";
import {db} from "../../Config/firestore";
import { withRouter } from "react-router";
import { useTranslation } from 'react-i18next';
import {iva} from '../../Config/Fees'
import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
import {stripePublicKey} from "../../Config/StripeCredentials"

function PayButton(props) {
  const { usuario } = useContext(Auth);
  const [show, setShow] = useState(false);
  const [showLogin,setshowLogin] = useState(false)
  const curr = new Date()
  const expire = new Date(curr.getFullYear(),curr.getMonth()+1,curr.getDate())
  const [trialClass,settrialClass] = useState(null)
  const stripeAccount =  props.products.length>0?props.products[0].data.instructor?props.products[0].data.instructor.stripeAccountID:null:null
  const { t } = useTranslation();

  const stripePromise = loadStripe(stripePublicKey, { stripeAccount: stripeAccount})

  var days = expire.getDate().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})
  var month = (expire.getMonth()+1).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})
  var year = expire.getFullYear()
  const [expireDate] = useState(days+'/'+month+'/'+year)

  const handleClose = () => {
    setShow(false)
    if (props.cart) {
      window.location.reload(false)
    }
  }
  const handleCloseLogin = () => setshowLogin(false);
  const handleShowLogin = () => setshowLogin(true);

  const searchUsuario = () =>{
    if (usuario) {
        var docRef = db.collection("Users").doc(usuario.uid);
         docRef.get().then((doc)=>{
        if (doc.exists) {
            if (!props.cart&&props.type==='Zoom') {
            settrialClass(doc.data().trialClass)
            }
            setShow(true)
        } else {
            setshowLogin(true)
        }
        }).catch(function(error) {
            return console.log("Error getting document:", error);
        });
      }else {
              setshowLogin(true)
            }
  }

  return(
    <>
      <button className={`btn-info btn-${props.size} rounded`} onClick={searchUsuario}><CheckSquare/> {props.cart?t('cart.5','Proceder al pago'):props.trialClass===0?t('cart.6','Clase prueba'):t('cart.7','Comprar ahora')}</button>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>{t('cart.8','Total a pagar')}: ${(props.subtotal*(1+iva)+StripeFee(props.subtotal*(1+iva), props.products.length)).toFixed(2)}<br/>
            {!props.cart?<div clasaName='d-flex flex-row'>
              <p style={{color:'gray',fontSize:'small'}}>Subtotal: ${props.subtotal} + {t('cart.2','Tarifa por transacción')}: ${StripeFee(props.subtotal*(1+iva), props.products.length).toFixed(2)}</p>
            </div>:null}
          {(props.subtotal*(1+iva)+StripeFee(props.subtotal*(1+iva), props.products.length)).toFixed(2)<=10?<p style={{color:'red',fontSize:'small'}}>{t('cart.9','Tu total a pagar debe ser mayor a $10')}</p>:null}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Elements stripe={stripePromise}>
            <PaymentForm stripeAccount={stripeAccount} trialClass={trialClass} subtotal={props.subtotal} total={(props.subtotal*(1+iva)+StripeFee(props.subtotal*(1+iva))).toFixed(2)} products={props.products} cart={props.cart?true:false} expire={expire} now={curr}/>
          </Elements>
        </Modal.Body>
        {!props.cart?props.type!=='Zoom'?
        <Modal.Footer>
          <h5>{t('cart.10','Vigente hasta')} {expireDate}</h5>
        </Modal.Footer>:null:null}
      </Modal>

      <Modal
        show={showLogin}
        onHide={handleCloseLogin}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Body >
          {usuario? <p>{t('cart.11','Debes de cambiar tu tipo de cuenta a "Usuario" para poder realizar compras. Puedes regresar al tipo "Instructor" cuando quieras, tu información no se perderá.')}</p>
          :<Signup />}
        </Modal.Body>
        {usuario?<Modal.Footer>
          <Button variant="secondary" onClick={handleCloseLogin}>
            {t('cart.12','Cancelar')}
          </Button>
          <Button variant="primary" onClick={()=>{props.history.push('/account-type')}}>
            {t('cart.13','Cambiar tipo de cuenta')}
          </Button>
        </Modal.Footer>:null}
      </Modal>
    </>
  )
}

export default withRouter(PayButton)
