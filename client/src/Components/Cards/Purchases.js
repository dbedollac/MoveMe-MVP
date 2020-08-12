import React,{useContext, useEffect, useState} from 'react';
import CoachName from '../Atoms/CoachName'
import {db} from '../../Config/firestore'
import { Auth } from "../../Config/AuthContext";

function CarritoProduct(props) {
  const { usuario } = useContext(Auth);
  const[expireDate,setexpireDate] = useState(null)
  const[purchaseDate,setpurchaseDate] = useState(null)


  useEffect(()=>{

    if (props.expire) {
      var days = props.expire.getDate().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})
      var month = (props.expire.getMonth()+1).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})
      var year = props.expire.getFullYear()

      setexpireDate(days+'/'+month+'/'+year)
    }

    if(props.date){
      var days = props.date.getDate().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})
      var month = (props.date.getMonth()+1).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})
      var year = props.date.getFullYear()

      setpurchaseDate(days+'/'+month+'/'+year)
    }
  },[])

  return(
    <div className='card'>
      <div className='card-body'>
        <div className='card-title d-flex flex-row justify-content-between'>
          <h4>{props.type} {props.startTime?'('+props.startTime.time+')':null}{props.type.includes('Video')||props.type.includes('Reto')?'(Vigente hasta '+expireDate+')':null}</h4>
        </div>
        <h5 className="card-subtitle text-muted">{props.claseData?props.claseData.title:null}</h5>
        <p>${props.type.includes('Reto')?props.instructor.monthlyProgram.Price
          :props.type.includes('Zoom')?props.claseData.zoomPrice
          :props.claseData.offlinePrice}
        </p>
        <p><strong>Comprado el {purchaseDate}</strong></p>
      </div>
      <div className='card-footer'>
        <CoachName uid={props.instructor.uid} profileName={props.instructor.profileName} profilePicture={props.instructor.imgURL?props.instructor.imgURL:null}/>
      </div>
    </div>
  )
}

export default CarritoProduct
