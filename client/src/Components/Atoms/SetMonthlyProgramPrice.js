import React, { useState, useContext, useEffect } from "react";
import {UncontrolledPopover, PopoverHeader, PopoverBody } from 'reactstrap'
import MonthlyProgramStatus from '../Atoms/MonthlyProgramStatus'
import { InfoCircleFill} from 'react-bootstrap-icons';
import {db} from '../../Config/firestore'
import { Auth } from "../../Config/AuthContext";

function SetMonthlyProgramPrice() {
  const { usuario } = useContext(Auth);
  const [price,setPrice] = useState(null)

  useEffect(()=>{
    if (usuario) {
    var docRef = db.collection("Instructors").doc(usuario.email);
      docRef.get().then((doc)=> {
          if (doc.exists) {
            setPrice(doc.data().monthlyProgram.Price)
          } else {
              console.log("No such document!");
          }
      }).catch(function(error) {
          console.log("Error getting document:", error);
      });
    }
  },[usuario])

  const handlePrice = (event) =>{
    setPrice(event.target.value)
  }

  const handleSave = () =>{
    db.collection("Instructors").doc(usuario.email).set({
      monthlyProgram: {
        Price: price
      }
    },{ merge: true }).then(
      alert('Se fijó el precio de tu programa con éxito')
    ).catch(error => console.log(error))
    window.location.reload(false)
  }

  return(
      <div className='card-header d-flex flex-row'>
        <div className='col-10 d-flex flex-row p-3 justify-content-center align-items-center'>
              <InfoCircleFill size={'3em'} color='gray' style={{cursor:'pointer'}} id='price-info'/>
              <UncontrolledPopover trigger="focus" placement="bottom" target="price-info">
                <PopoverHeader>Programa Mensual</PopoverHeader>
                <PopoverBody>El precio que fijes se cobrará automáticamente todos los meses
                a aquellos usuarios que se suscriban a tu programa. Podrán unirse a todas las clases que agendes aquí, así como ver todos los videos que hayas subido para rentar.</PopoverBody>
              </UncontrolledPopover>
              <div className='d-flex flex-row align-items-center justify-content-center col-6'>
                <h4 className='mr-2'>Precio</h4>
                <input type='number' min='100'step='50' placeholder='400' onChange={handlePrice} value={price}/>
                <p className='ml-1 pt-2'>pesos mexicanos (MXN)</p>
              </div>
              <button className='btn-lg btn-primary' onClick={handleSave}>Guardar</button>
        </div>
        <div className='col-2 d-flex flex-row  align-items-center' >
            <MonthlyProgramStatus />
        </div>
      </div>
            )
}
  export default SetMonthlyProgramPrice
