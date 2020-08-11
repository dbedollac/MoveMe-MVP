import React,{useState,useContext,useEffect} from 'react'
import {db} from '../../Config/firestore'
import { Auth } from "../../Config/AuthContext";
import {proxyurl} from '../../Config/proxyURL'
import {CreditCard} from 'react-bootstrap-icons'
import visaCard from '../Cards/Images/Visa.png'
import masterCard from '../Cards/Images/MasterCard.png'

function CreditCardDetails(props) {
  const { usuario } = useContext(Auth);


  return(
    <div className='d-flex flex-column align-item-start'>
      <div className='d-flex flex-row justify-content-start align-items-center'>
        <div className='pb-3 mr-2'>
          {props.details?props.details.card.brand.includes('visa')?
          <img src={visaCard} alt='Logo Visa' width='50px'/>
          :props.details.card.brand.includes('master')?
          <img src={masterCard} alt={'Logo MasterCard'}/>
          :<CreditCard size={'30px'}/>:null}
        </div>
        <p>{props.details?props.details.card.brand:null} que termina en {props.details?props.details.card.last4:null}</p>
        <p className='ml-5'>Expira {props.details?props.details.card.exp_month:null}/{props.details?props.details.card.exp_year:null}</p>
      </div>
      <p>{props.details?props.details.billing_details.name:null}</p>
    </div>
  )
}

export default CreditCardDetails
