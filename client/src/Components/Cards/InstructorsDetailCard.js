import React, { useState, useContext, useEffect } from "react";
import { CameraVideoFill, ChevronCompactUp, EyeFill} from 'react-bootstrap-icons';
import VideoPlayer from '../Atoms/VideoPlayer'
import {db} from '../../Config/firestore'
import { Auth } from "../../Config/AuthContext";
import RefreshToken from '../Atoms/RefreshToken'
import GetZoomMeetings from '../Molecules/GetZoomMeetings'
import AddToCar from '../Molecules/AddToCar'
import CoachName from '../Atoms/CoachName'
import AddFreeVideo from '../Atoms/AddFreeVideo'
import {Collapse} from 'react-bootstrap'
import { withRouter } from "react-router";

function InstructorsDetailCard(props) {
const { usuario } = useContext(Auth);
const [instructor, setInstructor] = useState(props.instructor)
const [open, setOpen] = useState(false);
const [trialClass,settrialClass] = useState(null)

const handleOpen = () =>{
  setOpen(!open)
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

      return(
        <div className='col-12 card'>
        {console.log(props.startTime)}
          <div className='d-flex flex-column flex-md-row align-items-center justify-content-center pl-5 pt-1'>
            <h3 className='text-center text-break' style={{color: '#F39119'}}>{props.data.title}</h3>
            <div className=' d-flex flex-row justify-content-end ml-md-5'>
              {props.match.params.uid||props.market? <CoachName uid={props.instructor.id} profileName={props.instructor.data.profileName} profilePicture={props.instructor.data.imgURL?props.instructor.data.imgURL:null}/>:null}
            </div>
          </div>

          <div className= 'card-body d-flex flex-row flex-wrap justify-content-between'>

              {props.data.description.length > 0?
              <div className='col-12 col-md-6 mb-5 mb-md-0 d-flex flex-column'>
                <h4>Descripción</h4>
                <p>{props.data.description}</p>
                {props.data.videoURL&&!props.zoom?
                <div className='card card-link py-1'>
                  <div className='d-flex flex-column flex-lg-row justify-content-around align-items-center'>

                  <div className='d-flex flex-row-reverse flex-md-row align-items-center justify-content-between'>
                    {open?<ChevronCompactUp onClick={() => setOpen(!open)} style={{cursor:'pointer'}} size={'2em'}/>
                    :<EyeFill onClick={() => setOpen(!open)} style={{cursor:'pointer'}} size={'2em'}/>}
                    <p className='text-center mx-2'>
                    <strong>Video para rentar</strong> <br/>(1 mes) {props.match.params.uid||props.market?!props.data.freeVideo? '$'+props.data.offlinePrice:null:null}</p>
                  </div>

                    {props.market?!props.data.freeVideo?<AddToCar instructor={instructor} claseVideo={props.data}/>
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
                  <h5>Clases por Zoom</h5>
                </div>
                <div style={{ overflowY: 'scroll', height:'250px'}}>
                  <GetZoomMeetings claseID={props.claseID} instructor={instructor} market={props.market?props.market:false} usertrialClass={trialClass} startTime={props.startTime}/>
                </div>
              </div>:null}

            <div className='col-12 col-md-6 d-flex flex-column'>
               <p><strong>Tipo de ejercicio: </strong>{props.data.type}</p>
               <p><strong>Dificultad: </strong>{props.data.level}</p>
               <p><strong>Equipo necesario: </strong>{props.data.equipment.length>0? props.data.equipment:'Ninguno'}</p>
               <p><strong>Duración: </strong>{props.data.duration} minutos</p>
               <p><strong>Precio por clase en Zoom: </strong>${props.data.zoomPrice} MXN</p>
               <p><strong>Precio por renta mensual del video: </strong>{props.data.freeVideo?'gratis':'$'+props.data.offlinePrice+' MXN'}</p>
            </div>


          </div>
        </div>
      )
}
export default withRouter(InstructorsDetailCard)
