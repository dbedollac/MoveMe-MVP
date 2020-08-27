import React,{useState,useEffect,useContext} from 'react'
import { withRouter } from "react-router";
import { Auth } from "../../Config/AuthContext";
import Header from '../Molecules/Header'
import { CaretDownSquareFill, GearFill, CollectionPlayFill, Calendar3Fill} from 'react-bootstrap-icons';
import {db,auth} from '../../Config/firestore'
import './FirstSteps.css'

function FirstSteps(props) {
  const { usuario } = useContext(Auth);
  const [newInstructor, setNewInstructor] = useState(true);

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

      auth.onAuthStateChanged((user) => {
        if (user===null) {
            props.history.push("/market");
        }
      })

      searchInstructor()
  },[usuario])

  return (
    <div>
    <Header instructor={newInstructor?false:true} />
      <div className='FirstSteps-container d-flex flex-column align-items-center'>
        <h2 className='pt-2'>¿Cómo iniciar?</h2>

        <div className='d-flex flex-column align-items-start justify-content-around col-10 mt-3'>
          <div className='d-flex flex-row align-items-center justify-content-start'><h3 className='mr-3'>1</h3><p className='text-justify'>En <strong>Configuración</strong> <GearFill /> agrega tus datos personales, foto de perfil y enlaza tu cuenta de Zoom.</p></div>
          <div className='d-flex flex-row align-items-center justify-content-start mt-2'><h3 className='mr-3'>2</h3><p className='text-justify'>En <strong>Mis Clases</strong> <CollectionPlayFill /> genera tus clases, sube videos para rentar y agenda clases en Zoom para cobrar por asistencia.</p></div>
          <div className='d-flex flex-row align-items-center justify-content-start mt-2'><h3 className='mr-3'>3</h3><p className='text-justify'>En <strong>Reto Mensual</strong> <Calendar3Fill /> ¡ desarrolla y activa tu reto ! Agenda clases por Zoom en las semanas del mes. Estas clases se agendarán automáticamente cada mes.</p></div>
          <div className='d-flex flex-row align-items-center justify-content-start mt-2'><h3 className='mr-3'>4</h3><p className='text-justify'>En <strong>más opciones</strong> <CaretDownSquareFill /> selecciona <i>Ver mi página comercial</i> y comparte la direción URL de tu página en tus redes sociales para ofrecer tus servicios fitnes.</p></div>
          <div className='d-flex flex-row align-items-center justify-content-start mt-2'><h3 className='mr-3'>5</h3><p className='text-justify'><strong>¡Comienza a generar nuevos ingresos!</strong></p></div>
        </div>

        {newInstructor?<button className='btn-lg btn-primary' onClick={()=>{props.history.push('/configuration-instructor')}}>¡Iniciar!</button>:null}
      </div>
    </div>
  )
}

export default withRouter(FirstSteps)
