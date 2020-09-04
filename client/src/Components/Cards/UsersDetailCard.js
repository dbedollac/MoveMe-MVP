import React, { useState, useContext, useEffect } from "react";
import VideoPlayer from '../Atoms/VideoPlayer'
import {db} from '../../Config/firestore'
import { Auth } from "../../Config/AuthContext";
import CoachName from '../Atoms/CoachName'
import { CameraVideoFill} from 'react-bootstrap-icons';
import { withRouter } from "react-router";
import { useTranslation } from 'react-i18next';

function UserDetailCard(props) {
  const { usuario } = useContext(Auth);
  const now = new Date().toISOString()
  const { t } = useTranslation();

      return(
        <div className='col-12 card'>
          <div className='d-flex flex-column flex-md-row align-items-center justify-content-between pl-5 pt-1'>
            <h3 className='text-center text-break' style={{color: '#F39119'}}>{props.data.title}</h3>
            <div className='col-12 col-md-5'>
              <CoachName uid={props.instructor.id} profileName={props.instructor.data.profileName} profilePicture={props.instructor.data.imgURL?props.instructor.data.imgURL:null}/>
            </div>
          </div>

          <div className= 'card-body d-flex flex-row flex-wrap justify-content-start'>

              {props.data.videoURL&&props.misVideos?
                <div className='col-12 d-flex flex-column'>
                  <VideoPlayer Video={props.data.videoURL} videoWidth='100%' videoHeight='450px' className="text-center card-img-top" market={false}/>
                </div>
              :
                <div className='col-12 d-flex flex-row justify-content-center mb-4'>
                  <button className={`rounded btn${props.startTime>now?'-outline-secondary':'-primary'} btn-lg`} onClick={()=>{window.location.href = props.joinURL}}>
                    <CameraVideoFill size={'30px'}/> {t('uCard.1','Unirme a la clase por Zoom')}
                  </button>
                </div>
                }

              {props.data.description.length>0?
                <div className='col-12 col-md-6 d-flex flex-column'>
                  <div className='d-flex flex-column'>
                    <h3>{t('iCard.1','Descripción')}</h3>
                    <p>{props.data.description}</p>
                  </div>
              </div>:null}

            <div className='col-12 col-md-6 d-flex flex-column'>
               <p><strong>{t('iCard.5','Tipo de ejercicio')}: </strong>{props.data.type}</p>
               <p><strong>{t('iCard.6','Dificultad')}: </strong>{props.data.level}</p>
               <p><strong>{t('iCard.7','Equipo necesario')}: </strong>{props.data.equipment.length>0? props.data.equipment:'Ninguno'}</p>
               <p><strong>{t('iCard.8','Duración')}: </strong>{props.data.duration} {t('iCard.9','minutos')}</p>
            </div>


          </div>
        </div>
      )
}

export default UserDetailCard
