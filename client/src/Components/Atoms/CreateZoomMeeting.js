import React, { useState, useContext, useEffect } from "react";
import {db} from '../../Config/firestore'
import { Auth } from "../../Config/AuthContext";

function CreateZoomMeeting(props) {
  const { usuario } = useContext(Auth);
  const [settings, setSettings] = useState({ topic: props.meetingTopic,
           type: props.meetingType,
           start_time: props.startTime,
           timezone: props.timeZone,
           settings: {
             host_video: true,
             join_before_host: true,
             approval_type: 0,
             registrants_email_notification: true}})


   const setMeeting = () =>{
     console.log(settings);
     var docRef = db.collection("Instructors").doc(usuario.email);
     docRef.get().then((doc)=>{

     if (doc.exists) {
           let url=proxyurl+"zoomAPI"

           let init = {
             method: 'POST',
             body: JSON.stringify({
              settings:props.settings,
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
                   startTime: resp.start_time,
                   monthlyProgram: props.monthlyProgram
                 })
                 console.log('Clase guardada');
               }

               )
           })

         } else {
          console.log("No such document!");
      }
      }).catch(function(error) {
          console.log("Error getting document:", error);
      });
      }

  return(
    <div>
      <button className='btn-lg btn-primary mt-2' onClick={setMeeting}>Guardar</button>
    </div>
  )
}

export default CreateZoomMeeting
