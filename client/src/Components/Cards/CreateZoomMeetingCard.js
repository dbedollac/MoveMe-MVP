import React, { useState, useContext, useEffect } from "react";
import RefreshToken from '../Atoms/RefreshToken'
import {db} from '../../Config/firestore'
import { Auth } from "../../Config/AuthContext";
import { ChevronCompactDown, CameraVideoFill } from 'react-bootstrap-icons';
import {proxyurl} from '../../Config/proxyURL'
import {Spinner} from 'react-bootstrap'
import { useTranslation } from 'react-i18next';

function CreateZoomMeetingCard(props) {
const { usuario } = useContext(Auth);
const [time, setTime] = useState('08:00')
const [timezone, setTimezone] = useState(null)
const [loading,setLoading] = useState(false)
const today = new Date()
const { t } = useTranslation();

const getDate = (date) => {
  var saleDate = new Date(date)
  var days = saleDate.getDate().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})
  var month = (saleDate.getMonth()+1).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})
  var year = saleDate.getFullYear()

    return(year+'-'+month+'-'+days)
}
const [date, setDate] = useState(getDate(today))

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
                        join_before_host: false,
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
                  monthlyProgram: false,
                  joinURL: resp.join_url
                }).then(alert(t('startZoom.9','La clase se agendó con éxito'))).then(window.location.reload(false))
                .catch(function(error) {
                    console.log("Error setting documents: ", error);
                })
              }
            )
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
    <div className='card d-flex flex-column align-items-center'>
      <div className='card-header col-12 d-flex flex-row align-items-center justify-content-center' style={{cursor:'pointer'}} >
        <CameraVideoFill size={'2em'}  color="#2C8BFF" />
        <p className='card-title mt-2 ml-1'><strong>{t('startZoom.7','Agendar Clase Zoom')}</strong></p>
      </div>
      <div className='card-body pt-2'>
        <div className='d-flex flex-column justify-content-around'>
          <input type="date" onChange={handleDate} min={getDate(today)} value={date}/>
          <input type="time" onChange={handleTime} value={time} className='mt-2'/>
          <div className='d-flex align-self-center ' disabled={true}>
            {loading?<Spinner animation="border" className='d-flex align-self-center'/>:
              <button className='btn-lg btn-primary mt-2' onClick={setMeeting} disabled={(time!==null&&date!==null&&props.claseID!==null)?false:true}>{t('startZoom.8','Guardar')}</button>
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateZoomMeetingCard
