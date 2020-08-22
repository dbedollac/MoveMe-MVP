import React,{useContext, useEffect, useState} from 'react';
import CoachName from '../Atoms/CoachName'
import {db} from '../../Config/firestore'
import { Auth } from "../../Config/AuthContext";
import { TrashFill } from 'react-bootstrap-icons';

function CarritoProduct(props) {
  const { usuario } = useContext(Auth);
  const[expireDate,setexpireDate] = useState(null)

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
      <div className='card-body d-flex flex-column flex-md-row align-items-end justify-content-start'>
        <h5 className='col-12 col-md-6'>{props.type} {props.startTime?'('+props.startTime.time+')':null}{props.type.includes('Video')||props.type.includes('Reto')?'(Vigente hasta '+expireDate+')':null}</h5>
        <h6 className="card-subtitle mb-2 text-muted col-12 col-md-5">{props.claseData?props.claseData.title:null}</h6>
        <TrashFill size={'2em'} onClick={deleteProduct} style={{cursor:'pointer'}}/>
      </div>
      <div className='card-footer d-flex flex-row justify-content-between align-items-center'>
        <CoachName uid={props.instructor.uid} profileName={props.instructor.profileName} profilePicture={props.instructor.imgURL?props.instructor.imgURL:null}/>
        <h5>${props.type.includes('Reto')?props.instructor.monthlyProgram.Price
          :props.type.includes('Zoom')?props.claseData.zoomPrice
          :props.claseData.offlinePrice}
        </h5>
      </div>
    </div>
  )
}

export default CarritoProduct
