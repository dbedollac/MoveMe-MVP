import React,{useContext} from 'react'
import Header from '../Molecules/Header'
import { Auth } from "../../Config/AuthContext";
import './PaymentMethods.css'

function PaymentMethods() {
  const { usuario } = useContext(Auth);

  return (
    <>
      <Header user={usuario?true:false}/>
      <div className='PaymentMethods-container'>
      </div>
    </>
  )
}

export default PaymentMethods
