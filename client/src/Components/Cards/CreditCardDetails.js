import React,{useState,useContext,useEffect} from 'react'
import {db} from '../../Config/firestore'
import { Auth } from "../../Config/AuthContext";
import {proxyurl} from '../../Config/proxyURL'
import {CreditCard} from 'react-bootstrap-icons'
import visaCard from '../Cards/Images/Visa.png'
import masterCard from '../Cards/Images/MasterCard.png'
import americanCard from '../Cards/Images/AmericanExpress.png'
import { useTranslation } from 'react-i18next';

function CreditCardDetails(props) {
  const { usuario } = useContext(Auth);
  const { t } = useTranslation();

  return(
    <div className='d-flex flex-column align-item-start'>
      <div className='d-flex flex-row justify-content-start align-items-center'>
        <div className='pb-3 mr-2'>
          {props.details?props.details.card.brand.includes('visa')?
          <img src={visaCard} alt='Visa' width='50px'/>
          :props.details.card.brand.includes('master')?
          <img src={masterCard} alt='Master Card' width='50px'/>
          :props.details.card.brand.includes('amex')?
          <img src={americanCard} alt='American Express' width='50px'/>
          :<CreditCard size={'30px'}/>:null}
        </div>
        <p>**** **** **** {props.details?props.details.card.last4:null}</p>
        <p className='ml-3 ml-md-5'>{t('misCompras.9','Expira')} {props.details?props.details.card.exp_month:null}/{props.details?props.details.card.exp_year:null}</p>
      </div>
      <p>{props.details?props.details.billing_details.name:null}</p>
    </div>
  )
}

export default CreditCardDetails
