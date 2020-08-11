import React, { useState, useContext, useEffect } from "react";
import {UncontrolledPopover, PopoverHeader, PopoverBody } from 'reactstrap'
import MonthlyProgramStatus from '../Atoms/MonthlyProgramStatus'
import AddToCar from '../Molecules/AddToCar'
import { ArrowLeft, InfoCircleFill} from 'react-bootstrap-icons';
import {db} from '../../Config/firestore'
import { Auth } from "../../Config/AuthContext";
import { withRouter } from "react-router";

function SetMonthlyProgramPrice(props) {
  const { usuario } = useContext(Auth);
  const [price,setPrice] = useState(null)
  const [instructorData, setinstructorData] = useState(null)

  useEffect(()=>{
    if (usuario||props.match.params.uid) {
    var docRef = db.collection("Instructors").doc(props.match.params.uid?props.match.params.uid:usuario.uid);
      docRef.get().then((doc)=> {
          if (doc.exists) {
            setPrice(doc.data().monthlyProgram.Price)
            setinstructorData(doc.data())
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
      alert('Se fijó el precio de tu reto con éxito')
    ).catch(error => console.log(error))
    window.location.reload(false)
  }

  const handleBack = () =>{
    window.location.reload(false)
  }

  if (props.instructor&&!props.instructor.data.monthlyProgram.Active) {
    return (<div className='d-flex flex-row align-items-center justify-content-around p-3'>
              <h3 style={{color:'gray'}}><i>Este reto no está activo</i></h3>
              <button className='btn-secondary rounded btn-lg' onClick={handleBack}><ArrowLeft /> Regresar</button>
            </div>)
  } else {
  return(
      <div className='card-header d-flex flex-row'>
        <div className='col-10 d-flex flex-row p-3 justify-content-center align-items-center'>
              <InfoCircleFill size={'3em'} color='gray' style={{cursor:'pointer'}} id='price-info'/>
              <UncontrolledPopover trigger="focus" placement="bottom" target="price-info">
                <PopoverHeader>Reto Mensual</PopoverHeader>
                {props.market?<PopoverBody>
                    El reto incluye todas las clases por Zoom agendadas en esta página más todas las clases en video del coach por un mes.
                  </PopoverBody>:
                <PopoverBody><strong>¡Activa tu Reto!</strong>
                <br/>Los usuarios que adquieran tu reto tendrán acceso por un mes a todas las clases por Zoom que agendes en esta página más todos los videos que hayas subido.
                Las clases de tu reto se agendarán de manera automática cada mes mientras se encuentre activo.
                </PopoverBody>}
              </UncontrolledPopover>
              <div className='d-flex flex-row align-items-center justify-content-center col-6'>
                <h4 className='mr-2'>Precio</h4>
                {props.market?<h4>$ {price}</h4>:
                <input type='number' min='100'step='50' placeholder='400' onChange={handlePrice} value={price}/>}
                {props.market?null:<p className='ml-1 pt-2'>pesos mexicanos (MXN)</p>}
              </div>
              {props.market?<AddToCar size='lg' instructor={instructorData} monthlyProgram={true}/>:
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
