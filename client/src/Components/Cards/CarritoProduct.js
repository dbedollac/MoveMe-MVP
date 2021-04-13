import React,{useContext, useEffect, useState} from 'react';
import {db} from '../../Config/firestore'
import { Auth } from "../../Config/AuthContext";
import { TrashFill } from 'react-bootstrap-icons';
import { useTranslation } from 'react-i18next';

function CarritoProduct(props) {
  const { usuario } = useContext(Auth);
  const[expireDate,setexpireDate] = useState(null)
  const { t } = useTranslation();

  const deleteProduct = async () =>{
    var docRef = db.collection('Users').doc(usuario.uid).collection('ShoppingCart').doc(props.id)
    await docRef.delete().then(console.log('Documento borrado')).catch(error => console.log(error))
    window.location.reload(false)
  }

  useEffect(()=>{
    if (props.startTime) {
      var now = new Date(Date.now()-3600000).toISOString()
      if (props.startTime.startTime<=now) {
        deleteProduct()
      }
    }

    if (props.expire) {
      var days = props.expire.getDate().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})
      var month = (props.expire.getMonth()+1).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})
      var year = props.expire.getFullYear()

      setexpireDate(days+'/'+month+'/'+year)
    }
  },[])

  return(
    <div className='card'>
      <div className='card-footer d-flex flex-column'>

        <div className='d-flex flex-row justify-content-between'>
          <h5 className='mr-2'>${props.type.includes('Reto')?props.instructor.monthlyProgram.Price
            :props.type.includes('Zoom')?props.claseData.zoomPrice
            :props.claseData.offlinePrice}
          </h5>
          <h5>{props.type.includes('Video')?t('misCompras.21','Clase en Video'):props.type.includes('Zoom')?t('misCompras.22','Clase por Zoom'):t('misCompras.23','Reto Mensual')} {props.startTime?'('+props.startTime.time+')':null}{props.type.includes('Video')||props.type.includes('Reto')?'(Vigente hasta '+expireDate+')':null}</h5>
        </div>

        <div className='d-flex flex-row'>
          <h6 className="card-subtitle text-muted col-11">{props.claseData?props.claseData.title:null}</h6>
          <TrashFill onClick={deleteProduct} style={{cursor:'pointer'}}/>
        </div>
      </div>
    </div>
  )
}

export default CarritoProduct
