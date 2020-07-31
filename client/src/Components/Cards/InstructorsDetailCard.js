import React, { useState, useContext, useEffect } from "react";
import { CameraVideoFill } from 'react-bootstrap-icons';
import VideoPlayer from '../Atoms/VideoPlayer'
import {db} from '../../Config/firestore'
import { Auth } from "../../Config/AuthContext";
import RefreshToken from '../Atoms/RefreshToken'
import GetZoomMeetings from '../Molecules/GetZoomMeetings'
import AddToCar from '../Atoms/AddToCar'
import CoachName from '../Atoms/CoachName'
import { withRouter } from "react-router";

function InstructorsDetailCard(props) {
const { usuario } = useContext(Auth);
const [instructor, setInstructor] = useState(props.instructor)

  useEffect(()=>{

    if (usuario) {
      if (!props.market) {
      var docRef = db.collection("Instructors").doc(usuario.uid);
      docRef.get().then( (doc)=>{
      if (doc.exists) {
            RefreshToken(usuario.uid, doc.data().zoomRefreshToken).catch(error => window.location.reload(false))
        } else {
            console.log("No such document!");
        }
        }).catch(function(error) {
            console.log("Error getting document:", error);
        });
    }


      if (!props.instructor) {
        var docRef = db.collection("Instructors").doc(usuario.uid);
        docRef.get().then( (doc)=>{
        if (doc.exists) {
              setInstructor({data:doc.data(),id:doc.id})
          } else {
              console.log("No such document!");
          }
          }).catch(function(error) {
              console.log("Error getting document:", error);
          });
      }
  }
},[usuario])

      return(
        <div className='col-12 card'>
          <div className='d-flex flex-row align-items-center justify-content-start pl-5 pt-1'>
            <div className='col-5'>
              {props.match.params.uid||props.market? <CoachName uid={props.instructor.id} profileName={props.instructor.data.profileName} profilePicture={props.instructor.data.imgURL?props.instructor.data.imgURL:null}/>:null}
            </div>
            <h2 className='text-left text-break px-2' style={{color: '#F39119'}}>{props.data.title}</h2>
          </div>
          <div className= 'card-body d-flex flex-row flex-wrap justify-content-start'>
            <div className='col-6 d-flex flex-column'>
              <div className='d-flex flex-row alig-items-center justify-content-center'>
                <CameraVideoFill size={'2em'} className='mr-2 mt-1' color="#2C8BFF" />
                <h3>Clases por Zoom</h3>
              </div>
              <div style={{ overflowY: 'scroll', height:'20vw'}}>
                <GetZoomMeetings claseID={props.claseID} instructor={instructor} market={props.market?props.market:false}/>
              </div>
            </div>

            {props.data.videoURL?
            <div className='col-6'>
              <VideoPlayer Video={props.data.videoURL} videoWidth='100%' videoHeight='100%' className="text-center card-img-top" market={props.match.params.uid||props.market?true:false}/>
              <div className='card-footer d-flex flex-row justify-content-around align-items-center'>
                <p className='text-center pt-1'>
                <strong>Video para rentar</strong> <br/>(4 semenas) {props.match.params.uid||props.market? '$'+props.data.offlinePrice:null}</p>
                {props.market?<AddToCar/>:null}
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
