import React,{useContext,useEffect,useState} from 'react'
import Header from '../Molecules/Header'
import { Auth } from "../../Config/AuthContext"
import CardSaved from '../Cards/CardSaved'
import './MisCompras.css'

function MisCompras() {
  const { usuario } = useContext(Auth);

  return(
    <div>
      <Header  user={usuario?true:false}/>
      <div className='MisCompras-container d-flex flex-column pt-2 align-items-center'>
        <div className='MisCompras-container-paymentMethod col-6 rounded p-1'>
          <CardSaved/>
        </div>
      </div>
    </div>
  )
}

export default MisCompras
