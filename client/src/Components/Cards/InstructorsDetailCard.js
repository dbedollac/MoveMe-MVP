import React from "react";
import { CameraVideoFill } from 'react-bootstrap-icons';
import VideoPlayer from '../Atoms/VideoPlayer'

function InstructorsDetailCard(props) {

      return(
        <div className='col-12 card'>
          <h2 className='text-center text-break px-2' style={{color: '#F39119'}}>{props.data.title}</h2>
          <div className= 'card-body d-flex flex-row flex-wrap justify-content-center'>
            {props.data.videoURL?
            <div className='col-6'>
              <VideoPlayer Video={props.data.videoURL} videoWidth='100%' videoHeight='100%' className="text-center card-img-top"/>
              <p className='card-footer text-center'><strong>Video para rentar</strong></p>
            </div>:null}

            <div className='col-6 d-flex flex-column'>
               <p><strong>Tipo de ejercicio: </strong>{props.data.type}</p>
               <p><strong>Dificultad: </strong>{props.data.level}</p>
               <p><strong>Equipo necesario: </strong>{props.data.equipment.length>0? props.data.equipment:'Ninguno'}</p>
               <p><strong>Duración: </strong>{props.data.duration} minutos</p>
               <p><strong>Precio por clase en Zoom: </strong>${props.data.zoomPrice} MXN</p>
               <p><strong>Precio por renta mensual del video: </strong>${props.data.offlinePrice} MXN</p>
            </div>

            {props.data.description.length > 0?
            <div className='col-6 d-flex flex-column'>
              <h3>Descripción</h3>
              <p>{props.data.description}</p>
            </div>:null}

            <div className='col-6 d-flex flex-column'>
              <div className='d-flex flex-row alig-items-center justify-content-center'>
                <CameraVideoFill size={'2em'} className='mr-2 mt-1' color="#2C8BFF" />
                <h3>Clases por Zoom</h3>
              </div>
              <p>Meeting</p>
              <p>Meeting</p>
              <p>Meeting</p>
            </div>
          </div>
        </div>
      )
}
export default InstructorsDetailCard