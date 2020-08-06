import React, {useState,useEffect,useContext} from 'react';
import { Auth } from "../../Config/AuthContext";
import {db, auth} from '../../Config/firestore'
import Header from '../Molecules/Header'
import { withRouter } from "react-router";
import CarritoProduct from '../Cards/CarritoProduct'
import PayButton from '../Atoms/PayButton'
import StripeFee from '../Atoms/StripeFee'
import './Carrito.css'

function Carrito(props) {
  const { usuario } = useContext(Auth);
  const [products,setProducts] = useState([])
  const [subtotal,setSubtotal] = useState(0)
  const [expire,setExpire] = useState(new Date(Date.now()+(24*28 * 60 * 60 * 1000)))

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
               Products.push({id:doc.id,data:doc.data()});
               doc.data().type.includes('Programa')?Prices.push(Number(doc.data().instructor.monthlyProgram.Price))
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
        <div className='col-6 d-flex flex-row justify-content-around Carrito-container-total rounded p-1'>
          <div className='d-flex flex-column'>
            <h6>Subtotal: ${subtotal.toFixed(2)}</h6>
            <h6>Tarifa por transacción: ${StripeFee(subtotal).toFixed(2)}</h6>
            <h4><strong>Total: ${(subtotal+StripeFee(subtotal)).toFixed(2)}</strong></h4>
          </div>
          <div className='d-flex flex-column justify-content-around'>
            <PayButton subtotal={subtotal} cart={true}/>
            <p style={{cursor:'pointer'}} onClick={vaciarCarrito}><i>Vaciar Carrito</i></p>
          </div>
        </div>

        <div className='col-6'>
          {products.length===0? <h4 style={{color:'gray'}} className='text-center py-5'><i>Tu carrito está vacío</i></h4>
            :products.map(product =>(
            <div className='pt-2' key={product.id}>
              <CarritoProduct claseData={product.data.claseData?product.data.claseData:null}
              instructor={product.data.instructor}
              meetingID={product.data.meetingID?product.data.meetingID:null}
              startTime={product.data.startTime?product.data.startTime:null}
              type={product.data.type}
              expire={product.data.type.includes('Video')?expire:null}
              id={product.id}/>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}

export default withRouter(Carrito)
