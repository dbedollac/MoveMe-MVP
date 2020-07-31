import React, { useState, useContext, useEffect } from "react";
import {UncontrolledPopover, PopoverHeader, PopoverBody } from 'reactstrap'
import MonthlyProgramStatus from '../Atoms/MonthlyProgramStatus'
import AddToCar from '../Atoms/AddToCar'
import { ArrowLeft, InfoCircleFill} from 'react-bootstrap-icons';
import {db} from '../../Config/firestore'
import { Auth } from "../../Config/AuthContext";
import { withRouter } from "react-router";

function SetMonthlyProgramPrice(props) {
  const { usuario } = useContext(Auth);
  const [price,setPrice] = useState(null)

  useEffect(()=>{
    if (usuario||props.match.params.uid) {
    var docRef = db.collection("Instructors").doc(props.match.params.uid?props.match.params.uid:usuario.uid);
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
    db.collection("Instructors").doc(usuario.uid).set({
      monthlyProgram: {
        Price: price
      }
    },{ merge: true }).then(
      alert('Se fijó el precio de tu programa con éxito')
    ).catch(error => console.log(error))
    window.location.reload(false)
  }

  const handleBack = () =>{
    window.location.reload(false)
  }

  if (props.instructor&&!props.instructor.data.monthlyProgram.Active) {
    return (<div className='d-flex flex-row align-items-center justify-content-around p-3'>
              <h3 style={{color:'gray'}}><i>Este programa no está activo</i></h3>
              <button className='btn-secondary rounded btn-lg' onClick={handleBack}><ArrowLeft /> Regresar</button>
            </div>)
  } else {
  return(
      <div className='card-header d-flex flex-row'>
        <div className='col-10 d-flex flex-row p-3 justify-content-center align-items-center'>
              <InfoCircleFill size={'3em'} color='gray' style={{cursor:'pointer'}} id='price-info'/>
              <UncontrolledPopover trigger="focus" placement="bottom" target="price-info">
                <PopoverHeader>Programa Mensual</PopoverHeader>
                {props.market?<PopoverBody>
                    Al suscribirte a este programa tendrás acceso a todas las clases de Zoom agendadas en esta página, así como a todo las clases en video del coach.
                    Se cargará a tu tarjeta este monto todos los meses de manera automática, puedes suspender tu suscripción cuando quieras.
                  </PopoverBody>:
                <PopoverBody>El precio que fijes se cobrará automáticamente todos los meses
                a aquellos usuarios que se suscriban a tu programa. Podrán unirse a todas las clases que agendes aquí, así como ver todos los videos que hayas subido para rentar.
                </PopoverBody>}
              </UncontrolledPopover>
              <div className='d-flex flex-row align-items-center justify-content-center col-6'>
                <h4 className='mr-2'>Precio</h4>
                {props.market?<h4>$ {price}</h4>:
                <input type='number' min='100'step='50' placeholder='400' onChange={handlePrice} value={price}/>}
                {props.market?null:<p className='ml-1 pt-2'>pesos mexicanos (MXN)</p>}
              </div>
              {props.market?<AddToCar size='lg'/>:
              <button className='btn-lg btn-primary' onClick={handleSave}>Guardar</button>}
        </div>
        {props.market?
          <div className='col-2 d-flex flex-row  align-items-center'>
            <button className='btn-secondary rounded btn-lg' onClick={handleBack}><ArrowLeft /> Regresar</button>
          </div>
          :
        <div className='col-2 d-flex flex-row  align-items-center' >
            <MonthlyProgramStatus />
        </div>}
      </div>
    )}
}
  export default withRouter(SetMonthlyProgramPrice)
