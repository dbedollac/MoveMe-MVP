import React, { useState, useContext, useEffect } from "react";
import {UncontrolledPopover, PopoverHeader, PopoverBody } from 'reactstrap'
import MonthlyProgramStatus from '../Atoms/MonthlyProgramStatus'
import AddToCar from '../Molecules/AddToCar'
import { ArrowLeft, InfoCircleFill} from 'react-bootstrap-icons';
import {db} from '../../Config/firestore'
import { Auth } from "../../Config/AuthContext";
import { withRouter } from "react-router";
import { useTranslation } from 'react-i18next';

function SetMonthlyProgramPrice(props) {
  const { usuario } = useContext(Auth);
  const [price,setPrice] = useState(null)
  const [instructorData, setinstructorData] = useState(null)
  const [disableActive,setdisableActive] = useState(true)
  const { t } = useTranslation();

  useEffect(()=>{
    if (usuario||props.match.params.uid) {
    var docRef = db.collection("Instructors").doc(props.match.params.uid?props.match.params.uid:usuario.uid);
      docRef.get().then((doc)=> {
          if (doc.exists) {
            setPrice(doc.data().monthlyProgram.Price)
            if (doc.data().monthlyProgram.Price>=100) {
              setdisableActive(false)
            }
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
              <h4 style={{color:'gray'}}><i>{t('mPrice.1','Este reto no está activo')}</i></h4>
              <button className='btn-secondary rounded' onClick={handleBack}><ArrowLeft /> {t('mPrice.2','Regresar')}</button>
            </div>)
  } else {
  return(
      <div className='card-header d-flex flex-column flex-md-row rounded' style={{backgroundColor:'white'}}>
        <div className='col-12 col-md-6 d-flex flex-row p-md-3 justify-content-md-between justify-content-around align-items-center'>
            <div className='pr-2'>
              <InfoCircleFill size={'50px'} color='gray' style={{cursor:'pointer'}} id='price-info'/>
            </div>
              <UncontrolledPopover trigger="click" placement="bottom" target="price-info" >
                <PopoverHeader>{t('mPrice.3','Reto Mensual')}<br/>{!props.market?t('mPrice.4','(precio mínimo: $100)'):null}</PopoverHeader>
                {props.market?<PopoverBody>
                    {t('mPrice.5','El reto incluye todas las clases por Zoom agendadas en esta página más todas las clases en video del coach por un mes.')}
                  </PopoverBody>:
                <PopoverBody><strong>{t('mPrice.19','¡Activa tu Reto!')}</strong>
                <br/>{t('mPrice.6','Los usuarios que adquieran tu reto tendrán acceso por un mes a todas las clases por Zoom que agendes en esta página más todos los videos que hayas subido. Las clases de tu reto se agendarán de manera automática cada mes mientras se encuentre activo.')}
                </PopoverBody>}
              </UncontrolledPopover>

              <div className='d-flex flex-row align-items-center justify-content-center col-md-6'>
                <h4 className='mr-2'>{t('mPrice.7','Precio')}</h4>
                {props.market?<h4>$ {price}</h4>:
                <input type='number' min='100'step='50' placeholder='400' onChange={handlePrice} value={price} className='col-8'/>}
                {props.market?null:<p className='ml-1 pt-3'>MXN</p>}
              </div>
        </div>
        <div className='d-flex flex-row align-items-center justify-content-between col-12 col-md-6 pt-2 pt-md-0'>
          {props.market?
          <div className='col-10'>
            <AddToCar size='sm' instructor={instructorData} monthlyProgram={true}/>
          </div>
          :<button className='btn-lg btn-primary' onClick={handleSave} disabled={(price<100)}>{t('mPrice.8','Guardar')}</button>}
          {props.market?
            <div className='d-flex flex-row  align-items-center'>
              <button className='btn-secondary rounded btn-sm' onClick={handleBack}><ArrowLeft /> {t('mPrice.2','Regresar')}</button>
            </div>
            :
            <MonthlyProgramStatus disabled={disableActive}/>
          }
        </div>
      </div>
    )}
}
  export default withRouter(SetMonthlyProgramPrice)
