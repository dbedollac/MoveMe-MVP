import React, { useState, useContext, useEffect } from "react";
import {UncontrolledPopover, PopoverHeader, PopoverBody } from 'reactstrap'
import AddToCar from '../Molecules/AddToCar'
import { ArrowLeft, InfoCircleFill} from 'react-bootstrap-icons';
import {db} from '../../Config/firestore'
import { Auth } from "../../Config/AuthContext";
import { withRouter } from "react-router";
import { useTranslation } from 'react-i18next';
import {iva} from '../../Config/Fees'
import StripeFee from '../Atoms/StripeFee'
import Error from '../Atoms/Errores'

function SetMonthlyProgramPrice(props) {
  const { usuario } = useContext(Auth);
  const [price,setPrice] = useState(null)
  const [instructorData, setinstructorData] = useState(null)
  const [disableActive,setdisableActive] = useState(true)
  const [zoomMeetings,setZoomMeetings] = useState([])
  const [error,setError] = useState(false)
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

      if (!props.market) {
        if (zoomMeetings.length===0) {
         docRef.collection('ZoomMeetingsID').get()
                    .then(async function(querySnapshot) {
                      var now = new Date(Date.now()-3600000).toISOString()
                        querySnapshot.forEach(function(doc) {
                          if(doc.data().startTime>now){
                            if (!zoomMeetings.includes(doc.id)) {
                              zoomMeetings.push(doc.id)
                            }
                        }
                      }

                      )
                    })
                    .catch(function(error) {
                        console.log("Error getting documents: ", error);
                    });
                  }
      }
    }
  },[usuario])

  const handlePrice = (event) =>{
    setPrice(event.target.value)
  }

  const handleSave = () =>{
    if (props.videoClasesLength>0||zoomMeetings.length>0) {
      db.collection("Instructors").doc(usuario.uid).set({
        monthlyProgram: {
          Price: Number(price)
        }
      },{ merge: true }).then(
        alert(t('mPrice.22','Se fijó el precio con éxito'))
      ).catch(error => console.log(error))
    } else {
      setError(true)
    }
  }

  const handleBack = () =>{
    window.location.reload(false)
  }

  if (props.instructor&&props.instructor.data.monthlyProgram.Price<=0) {
    return (<div className='d-flex flex-row align-items-center justify-content-around p-3'>
              <h5 style={{color:'gray'}}><i>{t('mPrice.1','Este reto no está activo')}</i></h5>
              <button className='btn-light rounded' onClick={handleBack}><ArrowLeft /> {t('mPrice.2','Regresar')}</button>
            </div>)
  } else {
  return(
      <div className='text-center'>
        <div className='d-flex flex-column flex-md-row justify-content-around p-2 p-md-0'>
          <div className='col-12 col-md-6 d-flex flex-row p-md-3 justify-content-around align-items-center'>
              <div className='pr-5'>
                <InfoCircleFill size={'50px'} color='#d68930' style={{cursor:'pointer'}} id='price-info'/>
              </div>
                <UncontrolledPopover trigger="click" placement="bottom" target="price-info" >
                  <PopoverHeader>{t('mPrice.3','Reto Mensual')}<br/>{!props.market?t('mPrice.4','(precio mínimo: $100)'):null}</PopoverHeader>
                  {props.market?<PopoverBody>
                      {t('mPrice.5','El reto incluye todas las clases por Zoom agendadas en esta página más todas las clases en video del coach por un mes.')}
                    </PopoverBody>:
                  <PopoverBody><strong>{t('mPrice.19','¡Activa tu Reto!')}</strong>
                  <br/>{t('mPrice.6','Los usuarios que adquieran tu reto tendrán acceso por un mes a todas las clases por Zoom que agendes en esta página más todos los videos que hayas subido.')}
                  </PopoverBody>}
                </UncontrolledPopover>

                <div className='d-flex flex-column'>
                  <div className='d-flex flex-row align-items-center justify-content-center'>
                    <h4 className='mr-2'>{t('mPrice.7','Precio')}</h4>
                    {props.market?<p style={{fontSize:'large'}} className='mt-1'>$ {Math.ceil(price*(1+iva)+StripeFee(price*(1+iva)))}</p>:
                    <input type='number' min='100'step='50' placeholder='300' onChange={handlePrice} value={price} className='col-8'/>}
                    {props.market?null:<p className='ml-1 pt-3'>MXN</p>}
                  </div>
                  {props.market?null:<i style={{color:'gray',fontSize:'small'}}>{t('mPrice.20','Se agregará IVA más tarifa por transacción')}</i>}
                </div>
          </div>
          {props.market?
          <div className='d-flex flex-row align-items-center justify-content-between col-12 col-md-6 pt-2 pt-md-0'>
              <div className='col-10'>
                <AddToCar size='sm' instructor={instructorData} monthlyProgram={true}/>
              </div>
              <div className='d-flex flex-row  align-items-center'>
                  <button className='btn-light rounded btn-sm' onClick={handleBack}><ArrowLeft /> {t('mPrice.2','Regresar')}</button>
              </div>
          </div>
              :
          <div className='d-flex flex-column justify-content-center align-items-center pt-2 pt-md-0'>
            <button className='btn-lg btn-primary' onClick={handleSave} disabled={(price<100)}>{t('mPrice.8','Guardar')}</button>
          </div>
        }
        </div>
        {error?<Error mensaje={t('mPrice.21','Agrega una clase en video o una clase por Zoom')} />:null}
      </div>
    )}
}
  export default withRouter(SetMonthlyProgramPrice)
