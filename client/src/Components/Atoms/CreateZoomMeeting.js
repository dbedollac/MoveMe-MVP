import React, { useState, useContext, useEffect } from "react";
import RefreshToken from '../Atoms/RefreshToken'
import {db} from '../../Config/firestore'
import { Auth } from "../../Config/AuthContext";
import {proxyurl} from '../../Config/proxyURL'
import {Spinner} from 'react-bootstrap'
import { useTranslation } from 'react-i18next';

function CreateZoomMeeting(props) {
const { usuario } = useContext(Auth);
const [time, setTime] = useState('08:00')
const [date, setDate] = useState(null)
const [timezone, setTimezone] = useState(null)
const zoomDate = props.dayDate
const [loading,setLoading] = useState(false)
const { t } = useTranslation();

  useEffect(()=>{
    setTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone)
    var days = zoomDate.getDate().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})
    var month = (zoomDate.getMonth()+1).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})
    var year = zoomDate.getFullYear()

    setDate(year+'-'+month+'-'+days)
  },[usuario])

  const handleTime = (event) =>{
    setTime(event.target.value)
  }

  const setMeeting = () =>{
    setLoading(true)
    if(time){
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
                  joinURL: resp.join_url,
                  dayNumber: props.dayDate.getDate().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false}),
                  monthNumber: (props.dayDate.getMonth()+1).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})
                }).then(window.location.reload(false))
                .catch(function(error) {
                    console.log("Error setting documents: ", error);
                })
              }
            )
          }, function(error) {
              console.log(error.message)
              window.location.reload(false)})

        } else {
         console.log("No such document!");
     }
     }).catch(function(error) {
         console.log("Error getting document:", error);
         });
       }
     }

  return(
      <div className='d-flex flex-row'>
        {loading?<Spinner animation="border" className='mr-2'/> :
        <button className='btn-primary mr-2' onClick={setMeeting} disabled={(time!==null&&props.claseID!==null)?false:true}>{t('mProgram.4','Agregar')}</button>
        }
        <input type="time" onChange={handleTime} value={time}/>
      </div>
    )

  }

export default CreateZoomMeeting
