import React, { useState, useContext, useEffect } from "react";
import RefreshToken from '../Atoms/RefreshToken'
import {db} from '../../Config/firestore'
import { Auth } from "../../Config/AuthContext";
import {proxyurl} from '../../Config/proxyURL'
import {Spinner} from 'react-bootstrap'

function CreateZoomMeeting(props) {
const { usuario } = useContext(Auth);
const [time, setTime] = useState(null)
const [date, setDate] = useState(null)
const [timezone, setTimezone] = useState(null)
const zoomDate = new Date()
const [loading,setLoading] = useState(false)


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
                      recurrence: {
                        type: 3,
                        repeat_interval: 1,
                        monthly_week: props.week,
                        monthly_week_day: props.dayNumber,
                        end_times: 50
                      },
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
                  startTime: resp.occurrences[0].start_time,
                  monthlyProgram: props.meetingType===2?false:true,
                  week:props.week,
                  dayNumber: props.dayNumber,
                  dayName: props.dayName,
                  joinURL: resp.join_url
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
        <button className='btn-primary mr-2' onClick={setMeeting} disabled={(time!==null&&props.claseID!==null)?false:true}>Agregar</button>
        }
        <input type="time" onChange={handleTime} className='col-8'/>
      </div>
    )

  }

export default CreateZoomMeeting
