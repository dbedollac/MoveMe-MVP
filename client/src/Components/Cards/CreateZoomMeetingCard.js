import React, { useState, useContext, useEffect } from "react";
import RefreshToken from '../Atoms/RefreshToken'
import {db} from '../../Config/firestore'
import { Auth } from "../../Config/AuthContext";
import { ChevronCompactDown, CameraVideoFill } from 'react-bootstrap-icons';
import {proxyurl} from '../../Config/proxyURL'
import {Spinner} from 'react-bootstrap'

function CreateZoomMeetingCard(props) {
const { usuario } = useContext(Auth);
const [time, setTime] = useState(null)
const [date, setDate] = useState(null)
const [timezone, setTimezone] = useState(null)
const [loading,setLoading] = useState(false)

  useEffect(()=>{
    setTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone)
  })

  const handleTime = (event) =>{
    setTime(event.target.value)
  }

  const handleDate = (event) =>{
    setDate(event.target.value)
  }

  const setMeeting = () =>{
    setLoading(true)
    var docRef = db.collection("Instructors").doc(usuario.uid);
    docRef.get().then((doc)=>{

    if (doc.exists) {
          let url=proxyurl+"zoomAPI"

          let init = {
            method: 'POST',
            body: JSON.stringify({
             settings:{ topic: props.meetingTopic,
                      type: props.meetingType,
                      start_time: date+'T'+time+':00',
                      timezone: timezone,
                      settings: {
                        host_video: true,
                        join_before_host: true,
                        approval_type: 0,
                        registrants_email_notification: true}},
             token: doc.data().zoomToken
             }),
             headers: {
               "content-type": "application/json"
             }
          }

          fetch(url,init).then((response)=>{
              Promise.resolve(response.json()).then( (resp) =>{
                db.collection("Instructors").doc(usuario.uid).collection("ZoomMeetingsID").doc(resp.id.toString()).set({
                  claseID: props.claseID,
                  meetingID: resp.id,
                  startTime: resp.start_time,
                  monthlyProgram: props.meetingType===2?false:true,
                  joinURL: resp.join_url
                })
                alert('La clase se agendó con éxito')
              }
            ).then(window.location.reload(false))
          }, function(error) {
              console.log(error.message)
              })

        } else {
         console.log("No such document!");
     }
     }).catch(function(error) {
         console.log("Error getting document:", error);
     });
     }

  return(
    <div className='card'>
      <div className='card-header d-flex flex-row align-items-center justify-content-around' style={{cursor:'pointer'}} >
        <CameraVideoFill size={'2em'}  color="#2C8BFF" />
        <p className='card-title mt-2'><strong>Agendar Clase Zoom</strong></p>
      </div>
      <div className={`card-body pt-2`}>
        <div className='d-flex flex-column justify-content-around'>
          <div className='d-flex flex-column col-10'>
            <input type="date" onChange={handleDate}/>
            <input type="time" onChange={handleTime}/>
          </div>
          <div className='d-flex align-self-center ' disabled={true}>
          {loading?<Spinner animation="border" className='d-flex align-self-center'/>:
            <button className='btn-lg btn-primary mt-2' onClick={setMeeting} disabled={(time!==null&&date!==null&&props.claseID!==null)?false:true}>Guardar</button>
          }
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateZoomMeetingCard
