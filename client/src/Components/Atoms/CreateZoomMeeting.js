import React, { useState, useContext, useEffect } from "react";
import RefreshToken from '../Atoms/RefreshToken'
import {db} from '../../Config/firestore'
import { Auth } from "../../Config/AuthContext";
import {proxyurl} from '../../Config/proxyURL'

function CreateZoomMeeting(props) {
const { usuario } = useContext(Auth);
const [time, setTime] = useState(null)
const [date, setDate] = useState(null)
const [timezone, setTimezone] = useState(null)
const zoomDate = new Date()


  useEffect(()=>{
    setTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone)
    var days = zoomDate.getDate().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})
    var month = (zoomDate.getMonth()+1).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})
    var year = zoomDate.getFullYear()

    setDate(year+'-'+month+'-'+days)
  })

  const handleTime = (event) =>{
    setTime(event.target.value)
  }

  const setMeeting = () =>{
    if(time){
    var docRef = db.collection("Instructors").doc(usuario.email);
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
                      recurrence: {
                        type: 3,
                        repeat_interval: 1,
                        monthly_week: props.week,
                        monthly_week_day: props.dayNumber
                      },
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
                db.collection("Instructors").doc(usuario.email).collection("ZoomMeetingsID").doc().set({
                  claseID: props.claseID,
                  meetingID: resp.id,
                  startTime: resp.occurrences[0].start_time,
                  monthlyProgram: props.meetingType===2?false:true,
                  week:props.week,
                  dayNumber: props.dayNumber,
                  dayName: props.dayName
                })
                window.location.reload(false)
                alert('La clase se agendó con éxito')
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
        <button className='btn-primary mr-2' onClick={setMeeting} disabled={(time!==null)?false:true}>Agregar</button>
        <input type="time" onChange={handleTime} className='col-8'/>
      </div>
    )

  }

export default CreateZoomMeeting
