import React, { useContext, useState } from "react";
import { useTranslation } from 'react-i18next';
import { Auth } from "../../Config/AuthContext";
import {proxyurl} from '../../Config/proxyURL'
import {db, auth} from '../../Config/firestore'
import {Spinner} from 'react-bootstrap'
import './StripeButton.css'

const StripeButton = (props) =>{
const { t } = useTranslation();
const { usuario } = useContext(Auth);
const [loading,setLoading] = useState(false)

const createSrtipeAccount = (e) =>{
  e.preventDefault()
  setLoading(true)
  fetch(proxyurl+'stripeAPI/create-account', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: usuario.email,
        business_link: 'https://moveme.fitness/coach/'+usuario.uid
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then(async (result) => {
        await db.collection('Instructors').doc(usuario.uid).set({
          stripeAccountID:result.account.id
        },{merge: true}).catch(error=>console.log(error))

        fetch(proxyurl+'stripeAPI/create-account-link', {
            method: 'post',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              account_id: result.account.id
            }),
          })
            .then((response) => {
              return response.json();
            })
            .then( (result) => {
              window.location.href = result.accountLinks.url
            })
      });
}


  return(
    <div>
      <button onClick={(e) => {createSrtipeAccount(e)}} className="stripe-connect">{loading?<Spinner animation="border" />:props.connected?t('config.38','Cuenta conectada'):t('config.37')}</button>
    </div>
  )
}

export default StripeButton
