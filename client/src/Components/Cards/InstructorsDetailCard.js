import React, { useState, useContext, useEffect } from "react";
import { CameraVideoFill } from 'react-bootstrap-icons';
import VideoPlayer from '../Atoms/VideoPlayer'
import {db} from '../../Config/firestore'
import { Auth } from "../../Config/AuthContext";
import RefreshToken from '../Atoms/RefreshToken'
import GetZoomMeetings from '../Molecules/GetZoomMeetings'
import AddToCar from '../Atoms/AddToCar'
import { withRouter } from "react-router";

function InstructorsDetailCard(props) {
const { usuario } = useContext(Auth);

  useEffect(()=>{
    if (usuario) {
      var docRef = db.collection("Instructors").doc(usuario.uid);
      docRef.get().then(async (doc)=>{
      if (doc.exists) {
            RefreshToken(usuario.uid, doc.data().zoomRefreshToken).catch(error => window.location.reload(false))
        } else {
            console.log("No such document!");
        }
        }).catch(function(error) {
            console.log("Error getting document:", error);
        });
    }
  })

      return(
        <div className='col-12 card'>
          <h2 className='text-center text-break px-2' style={{color: '#F39119'}}>{props.data.title}</h2>
          <div className= 'card-body d-flex flex-row flex-wrap justify-content-start'>

            <div className='col-6 d-flex flex-column'>
              <div className='d-flex flex-row alig-items-center justify-content-center'>
                <CameraVideoFill size={'2em'} className='mr-2 mt-1' color="#2C8BFF" />
                <h3>Clases por Zoom</h3>
              </div>
              <div style={{ overflowY: 'scroll', height:'10vw'}}>
                <GetZoomMeetings claseID={props.claseID} />
              </div>
            </div>

            {props.data.videoURL?
            <div className='col-6'>
              <VideoPlayer Video={props.data.videoURL} videoWidth='100%' videoHeight='100%' className="text-center card-img-top" market={props.match.params.uid?true:false}/>
              <div className='card-footer d-flex flex-row justify-content-around align-items-center'>
                <p className='text-center pt-1'>
                <strong>Video para rentar</strong> <br/>(4 semenas) {props.match.params.uid? '$'+props.data.offlinePrice:null}</p>
                {props.match.params.uid?<AddToCar/>:null}
              </div>
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

          </div>
        </div>
      )
}
export default withRouter(InstructorsDetailCard)
