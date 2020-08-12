import React, { useState, useContext, useEffect } from "react";
import VideoPlayer from '../Atoms/VideoPlayer'
import {db} from '../../Config/firestore'
import { Auth } from "../../Config/AuthContext";
import CoachName from '../Atoms/CoachName'
import { withRouter } from "react-router";

function UserDetailCard(props) {
  const { usuario } = useContext(Auth);

      return(
        <div className='col-12 card'>
          <div className='d-flex flex-row align-items-center justify-content-start pl-5 pt-1'>
            <div className='col-5'>
              <CoachName uid={props.instructor.id} profileName={props.instructor.data.profileName} profilePicture={props.instructor.data.imgURL?props.instructor.data.imgURL:null}/>
            </div>
            <h2 className='text-left text-break px-2' style={{color: '#F39119'}}>{props.data.title}</h2>
          </div>

          <div className= 'card-body d-flex flex-row flex-wrap justify-content-start'>

              {props.data.videoURL&&props.misVideos?
                <div className='col-12 d-flex flex-column'>
                  <VideoPlayer Video={props.data.videoURL} videoWidth='100%' videoHeight='450px' className="text-center card-img-top" market={false}/>
                </div>
              :null}

              {props.data.description.length > 0?
              <div className='col-6 d-flex flex-column'>
                <h3>Descripción</h3>
                <p>{props.data.description}</p>
              </div>:null}

            <div className='col-6 d-flex flex-column'>
               <p><strong>Tipo de ejercicio: </strong>{props.data.type}</p>
               <p><strong>Dificultad: </strong>{props.data.level}</p>
               <p><strong>Equipo necesario: </strong>{props.data.equipment.length>0? props.data.equipment:'Ninguno'}</p>
               <p><strong>Duración: </strong>{props.data.duration} minutos</p>
               <p><strong>Precio por clase en Zoom: </strong>${props.data.zoomPrice} MXN</p>
               <p><strong>Precio por renta mensual del video: </strong>${props.data.offlinePrice} MXN</p>
            </div>


          </div>
        </div>
      )
}

export default UserDetailCard
