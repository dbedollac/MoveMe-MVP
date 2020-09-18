import React,{useState,useEffect,useContext} from 'react'
import { withRouter } from "react-router";
import { Auth } from "../../Config/AuthContext";
import Header from '../Molecules/Header'
import { CaretDownSquareFill, GearFill, CollectionPlayFill, Calendar3Fill} from 'react-bootstrap-icons';
import {db,auth} from '../../Config/firestore'
import { useTranslation } from 'react-i18next';
import VideoPlayer from '../Atoms/VideoPlayer'
import { useMediaQuery } from 'react-responsive'
import './FirstSteps.css'

function FirstSteps(props) {
  const { usuario } = useContext(Auth);
  const [newInstructor, setNewInstructor] = useState(true);
  const { t } = useTranslation();
  const isMD = useMediaQuery({
    query: '(min-device-width: 768px)'
  })

  const searchInstructor = () =>{
      if(usuario){
      db.collection("Instructors").doc(usuario.uid).get().then( (doc) => {
        if (doc.exists) {
          if (doc.data().zoomToken.length>0) {
            setNewInstructor(doc.data().new)
          }
        }
        });
    }
    }

  useEffect(()=>{
    auth.onAuthStateChanged((usuario) => {
      if (usuario===null) {
          props.history.push("/market");
      }
    })
      searchInstructor()
  },[usuario])

  return (
    <div>
    <Header instructor={newInstructor?false:true} />
      <div className='FirstSteps-container d-flex flex-column align-items-center pb-2'>
        <h2 className='pt-2'>{t('fSteps.1','¿Cómo iniciar?')}</h2>
        <div className='d-flex flex-column flex-lg-row pt-1 align-items-center justify-content-around'>

          <VideoPlayer Video='https://youtu.be/B_yo1ZqVRAk' videoWidth={isMD?'500px':'280px'} videoHeight={isMD?'300px':'170px'} />
          <div className='d-flex flex-column align-items-start justify-content-around col-12 col-lg-7 mt-3 mt-md-0'>
            <div className='d-flex flex-row align-items-center justify-content-start'><h3 className='mr-3'>1</h3><p className='text-justify'>{t('fSteps.2','En ')}<strong>{t('fSteps.3','Configuración')}</strong> <GearFill />{t('fSteps.4',' agrega tus datos personales, foto de perfil y enlaza tu cuenta de Zoom.')}</p></div>
            <div className='d-flex flex-row align-items-center justify-content-start mt-2'><h3 className='mr-3'>2</h3><p className='text-justify'>{t('fSteps.2','En ')}<strong>{t('fSteps.5','Mis Clases')}</strong> <CollectionPlayFill />{t('fSteps.6',' genera tus clases, sube videos para rentar y agenda clases en Zoom para cobrar por asistencia.')}</p></div>
            <div className='d-flex flex-row align-items-center justify-content-start mt-2'><h3 className='mr-3'>3</h3><p className='text-justify'>{t('fSteps.2','En ')}<strong>{t('fSteps.7','Reto Mensual')}</strong> <Calendar3Fill />{t('fSteps.8',' ¡ desarrolla y activa tu reto ! Agenda clases por Zoom en las semanas del mes. Luego de activar tu reto, este se ofrecerá al precio que hayas decidido e incluirá todas las clases agendadas más acceso a tus videos por un mes.')}</p></div>
            <div className='d-flex flex-row align-items-center justify-content-start mt-2'><h3 className='mr-3'>4</h3><p className='text-justify'>{t('fSteps.2','En ')}<strong>{t('fSteps.9','más opciones')}</strong> <CaretDownSquareFill /> {t('fSteps.10','selecciona')} <i>{t('fSteps.11','Ver mi página comercial')}</i> {t('fSteps.12','y comparte la direción URL de tu página en tus redes sociales para ofrecer tus servicios fitnes.')}</p></div>
            <div className='d-flex flex-row align-items-center justify-content-start mt-2'><h3 className='mr-3'>5</h3><p className='text-justify'><strong>{t('fSteps.13','¡Comienza a generar nuevos ingresos!')}</strong></p></div>
          </div>

        </div>

        {usuario?newInstructor?<button className='btn-lg btn-primary' onClick={()=>{props.history.push('/configuration-instructor')}}>{t('fSteps.14','¡¡Iniciar!')}</button>:null:null}
      </div>
    </div>
  )
}

export default withRouter(FirstSteps)
