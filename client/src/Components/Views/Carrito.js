import React, {useState,useEffect,useContext} from 'react';
import { Auth } from "../../Config/AuthContext";
import {db, auth} from '../../Config/firestore'
import Header from '../Molecules/Header'
import { withRouter } from "react-router";
import CarritoProduct from '../Cards/CarritoProduct'
import PayButton from '../Atoms/PayButton'
import StripeFee from '../Atoms/StripeFee'
import {iva} from '../../Config/Fees'
import { useTranslation } from 'react-i18next';
import './Carrito.css'

function Carrito(props) {
  const { usuario } = useContext(Auth);
  const [products,setProducts] = useState([])
  const [subtotal,setSubtotal] = useState(0)
  const curr = new Date()
  const expire = new Date(curr.getFullYear(),curr.getMonth()+1,curr.getDate())
  const { t } = useTranslation();

  useEffect(()=>{
    auth.onAuthStateChanged((usuario) => {
      if (usuario===null) {
          props.history.push("/market");
      }
    })


    if (usuario) {
      var Products = []
      var Prices = []
      var docRef = db.collection("Users").doc(usuario.uid).collection("ShoppingCart");
      docRef.get().then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
               Products.push({id:doc.id,data:doc.data(),expire:expire});
               doc.data().type.includes('Reto')?Prices.push(Number(doc.data().instructor.monthlyProgram.Price))
                 :doc.data().type.includes('Zoom')?Prices.push(Number(doc.data().claseData.zoomPrice))
                 :Prices.push(Number(doc.data().claseData.offlinePrice))
          });
          setProducts(Products)
          setSubtotal(Prices.reduce((a,b)=>{return a+b},0))
      });
    }
  },[usuario,subtotal])

  const vaciarCarrito = async () =>{
    var docRef = db.collection("Users").doc(usuario.uid).collection("ShoppingCart")
     await docRef.get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
      doc.ref.delete()
    })
    }).catch(error => console.log(error))

    setProducts([])
    setSubtotal(0)
  }

  return(
    <div>
    <Header  user={usuario?true:false}/>
      <div className='Carrito-container d-flex flex-column pt-2 align-items-center'>
        <div className='col-10 col-md-7 d-flex flex-column flex-md-row justify-content-around Carrito-container-total rounded p-1'>
          <div className='d-flex flex-column'>
            <h4><strong>Total: ${(subtotal*(1+iva)+StripeFee(subtotal*(1+iva),products.length)).toFixed(2)}</strong></h4>
            <h6>Subtotal: ${subtotal.toFixed(2)}</h6>
            <h6>{t('cart.2','Tarifa por transacción')}: ${StripeFee(subtotal*(1+iva),products.length).toFixed(2)}</h6>
          </div>
          <div className='d-flex flex-column justify-content-around'>
            <PayButton subtotal={subtotal} cart={true} products={products}/>
            <p style={{cursor:'pointer'}} onClick={vaciarCarrito} className='mt-2'><i>{t('cart.3','Vaciar Carrito')}</i></p>
          </div>
        </div>

        <div className='col-11'>
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

export default withRouter(Carrito)
