import React, {useState,useEffect,useContext} from 'react';
import { Auth } from "../../Config/AuthContext";
import {db, auth} from '../../Config/firestore'
import Header from '../Molecules/Header'
import CarritoInstructor from '../Molecules/CarritoInstructor'
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
  const [prices,setPrices] = useState([])
  const [instructorsUID,setInstructorsUID] = useState([])
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
               doc.data().type.includes('Reto')?Prices.push({'uid':doc.data().instructor.uid,'price':Number(doc.data().instructor.monthlyProgram.Price)})
                 :doc.data().type.includes('Zoom')?Prices.push({'uid':doc.data().instructor.uid,'price':Number(doc.data().claseData.zoomPrice)})
                 :Prices.push({'uid':doc.data().instructor.uid,'price':Number(doc.data().claseData.offlinePrice)})
          });
          setProducts(Products)
          setPrices(Prices)
          setInstructorsUID(Array.from(new Set(Products.map(product => product.data.instructor.uid))))
      });
    }
  },[usuario])

  const vaciarCarrito = async () =>{
    var docRef = db.collection("Users").doc(usuario.uid).collection("ShoppingCart")
     await docRef.get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
      doc.ref.delete()
    })
    }).catch(error => console.log(error))

    setProducts([])
    setPrices([])
    window.location.reload(false)
  }

  return(
    <div className='Carrito-container'>
      <Header  user={usuario?true:false}/>
      {products.length===0? <h4 style={{color:'gray'}} className='text-center py-5'><i>{t('cart.4','Tu carrito está vacío')}</i></h4>:null}
      {products.length>0?<h5 className='p-2' onClick={vaciarCarrito} style={{'cursor':'pointer'}}><i>{t('cart.3','Vaciar carrito')}</i></h5>:null}
      <div className='col-12 d-flex flex-row flex-wrap'>
        {instructorsUID.map(uid =>
          <div className='col-12 col-md-4'>
            <CarritoInstructor products={products.filter(p => p.data.instructor.uid === uid)}
            subtotal={prices.filter(p => p.uid === uid).reduce((a,b)=>{return a+b.price},0)} />
          </div>
        )}
      </div>
    </div>
  )
}

export default withRouter(Carrito)
