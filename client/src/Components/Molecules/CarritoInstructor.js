import React, {useState,useEffect,useContext} from 'react';
import { withRouter } from "react-router";
import CarritoProduct from '../Cards/CarritoProduct'
import PayButton from '../Atoms/PayButton'
import StripeFee from '../Atoms/StripeFee'
import CoachName from '../Atoms/CoachName'
import {iva} from '../../Config/Fees'
import { useTranslation } from 'react-i18next';

function CarritoInstructor(props) {

  const products = props.products
  const subtotal = props.subtotal
  const curr = new Date()
  const expire = new Date(curr.getFullYear(),curr.getMonth()+1,curr.getDate())
  const { t } = useTranslation();
  const instructor_data = props.products.length > 0?props.products[0].data.instructor:null

  return(
      <div className='d-flex flex-column pt-2 align-items-center'>

        <div className='Carrito-container-total rounded p-1 d-flex flex-column align-items-center'>
          <div clasaName='d-flex flex-column flex-md-row justify-content-around '>
            {instructor_data?<CoachName uid={instructor_data.uid} profileName={instructor_data.profileName} profilePicture={instructor_data.imgURL?instructor_data.imgURL:null}/>:null}
            <div className='d-flex flex-column'>
              <h4><strong>Total: ${(subtotal*(1+iva)+StripeFee(subtotal*(1+iva))).toFixed(2)}</strong></h4>
              <h6>Subtotal: ${subtotal.toFixed(2)}</h6>
              <h6>{t('cart.2','Tarifa por transacción')}: ${StripeFee(subtotal*(1+iva)).toFixed(2)}</h6>
            </div>
            <div className='d-flex flex-column justify-content-around'>
              <PayButton subtotal={subtotal} cart={true} products={products}/>
            </div>
          </div>

          <div >
            {products.length===0? <h4 style={{color:'gray'}} className='text-center py-5'><i>{t('cart.4','Tu carrito está vacío')}</i></h4>
              :products.map(product =>(
              <div className='pt-2' key={product.id}>
                <CarritoProduct claseData={product.data.claseData?product.data.claseData:null}
                instructor={product.data.instructor}
                meetingID={product.data.meetingID?product.data.meetingID:null}
                startTime={product.data.startTime?product.data.startTime:null}
                type={product.data.type}
                expire={product.data.type.includes('Video')||product.data.type.includes('Reto')?expire:null}
                id={product.id}/>
              </div>
            ))}
          </div>
        </div>

      </div>
  )

}

export default withRouter(CarritoInstructor)
