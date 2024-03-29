import React, { useState, useContext, useEffect } from "react";
import { CameraVideoFill, ChevronCompactUp, PlayFill} from 'react-bootstrap-icons';
import VideoPlayer from '../Atoms/VideoPlayer'
import {db} from '../../Config/firestore'
import { Auth } from "../../Config/AuthContext";
import RefreshToken from '../Atoms/RefreshToken'
import GetZoomMeetings from '../Molecules/GetZoomMeetings'
import AddToCar from '../Molecules/AddToCar'
import CoachName from '../Atoms/CoachName'
import AddFreeVideo from '../Atoms/AddFreeVideo'
import EditClass from '../Molecules/EditClass'
import {Collapse} from 'react-bootstrap'
import { withRouter } from "react-router";
import { useTranslation } from 'react-i18next';
import {iva} from '../../Config/Fees'
import StripeFee from '../Atoms/StripeFee'

function InstructorsDetailCard(props) {
const { usuario } = useContext(Auth);
const [instructor, setInstructor] = useState(props.instructor)
const [open, setOpen] = useState(true);
const [trialClass,settrialClass] = useState(null)
const { t } = useTranslation();

const handleOpen = () =>{
  setOpen(false)
}

  useEffect(()=>{

    if (open) {
      if (props.match.params.uid||props.market) {
        setInterval(handleOpen,60000)
      }
    }

    if (usuario) {

      if (!props.market) {
      var docRef = db.collection("Instructors").doc(usuario.uid);
      docRef.get().then( (doc)=>{
      if (doc.exists) {
            RefreshToken(usuario.uid, doc.data().zoomRefreshToken)
        } else {
            console.log("No such document!");
        }
        }).catch(function(error) {
            console.log("Error getting document:", error);
        });
    }else {
      var docRef = db.collection("Users").doc(usuario.uid);
      docRef.get().then( (doc)=>{
      if (doc.exists) {
            settrialClass(doc.data().trialClass)
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
  }else{
    settrialClass(0)
  }
},[usuario,open])

      if (props.fitnessKit&&!props.market) {
        return (
          <div className='p-4' style={{backgroundColor:'white',borderRadius: '10px',borderWidth: '1px',borderColor: 'lightgray',borderStyle: 'solid'}}>
            <EditClass claseID={props.claseID} claseData={props.data} />
          </div>
        )
      }

      return(
        <div className='col-12 card'>
          <div className='d-flex flex-column flex-md-row align-items-center justify-content-center pl-5 pt-1'>
            <h3 className='text-center text-break' style={{color: '#F39119'}}>{props.data.title}</h3>
            <div className=' d-flex flex-row justify-content-end ml-md-5'>
              {props.match.params.uid||props.market? <CoachName uid={props.instructor.id} profileName={props.instructor.data.profileName} profilePicture={props.instructor.data.imgURL?props.instructor.data.imgURL:null}/>:null}
            </div>
          </div>

          <div className= 'card-body d-flex flex-row flex-wrap justify-content-between'>

              {props.data.description.length > 0?
              <div className='col-12 col-md-6 mb-5 mb-md-0 d-flex flex-column'>
                <h4>{t('iCard.1','Descripción')}</h4>
                <p>{props.data.description}</p>
                {props.data.videoURL&&!props.zoom?
                <div className='card card-link py-1'>
                  <div className='d-flex flex-column flex-lg-row justify-content-around align-items-center'>

                  <div className='d-flex flex-row-reverse flex-md-row align-items-center justify-content-between'>
                    {open?<ChevronCompactUp onClick={() => setOpen(!open)} style={{cursor:'pointer'}} size={'2em'}/>
                    :<PlayFill onClick={() => setOpen(!open)} style={{cursor:'pointer'}} size={'2em'}/>}
                    <p className='text-center mx-2'>
                    <strong>{t('iCard.2','Video para rentar')}</strong> <br/>{t('iCard.3','(1 mes)')} {!props.fitnessKit?props.match.params.uid||usuario&&props.market?!props.data.freeVideo? '$'+Math.ceil(props.data.offlinePrice*(1+iva)+StripeFee(props.data.offlinePrice*(1+iva))):null:null:null}</p>
                  </div>

                    {!props.fitnessKit&&props.market?!props.data.freeVideo&&props.data.offlinePrice!==0?<AddToCar instructor={instructor} claseVideo={props.data}/>
                    :<AddFreeVideo product={{
                      data:{instructor: instructor.data,
                        claseData: props.data,
                        meetingID: null,
                        startTime: null,
                        type: 'Clase en Video',
                        joinURL: null,
                        claseID: null,
                        monthlyProgram: null}
                    }}/>
                    :null}
                  </div>
                  <Collapse in={open}>
                    {open?
                    <div>
                      <VideoPlayer Video={props.data.videoURL} videoWidth='100%' videoHeight='300px' className="text-center card-img-top"/>
                    </div>:
                    <p>MoveMe</p>}
                  </Collapse>
                </div>:null}
              </div>:null}

              {!props.video?<div className='col-12 col-md-6 d-flex flex-column'>
                <div className=' d-flex flex-row alig-items-center justify-content-center'>
                  <CameraVideoFill size={'2em'} className='mr-2' color="#2C8BFF" />
                  <h5>{t('iCard.4','Clases por Zoom')}</h5>
                </div>
                <div>
                  <GetZoomMeetings claseID={props.claseID} instructor={instructor} market={props.market?props.market:false} usertrialClass={trialClass} startTime={props.startTime}/>
                </div>
              </div>:null}

            <div className='col-12 col-md-6 d-flex flex-column'>
               <p><strong>{t('iCard.5','Tipo de ejercicio')}: </strong>{t('allClases.'+props.data.type,props.data.type)}</p>
               <p><strong>{t('iCard.6','Dificultad')}: </strong>{t('allClases.'+props.data.level,props.data.level)}</p>
               <p><strong>{t('iCard.7','Equipo necesario')}: </strong>{props.data.equipment.length>0? props.data.equipment:t('allClases.22','Ninguno')}</p>
               <p><strong>{t('iCard.8','Duración')}: </strong>{props.data.duration} {t('iCard.9','minutos')}</p>
            </div>


          </div>
        </div>
      )
}
export default withRouter(InstructorsDetailCard)
