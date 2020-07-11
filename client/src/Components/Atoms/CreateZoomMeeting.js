import React, { useState, useContext, useEffect } from "react";
import { CameraVideoFill } from 'react-bootstrap-icons';
import {zoomID, zoomRedirectURL} from '../../Config/ZoomCredentials'
import {proxyurl} from '../../Config/proxyURL'
import RefreshToken from './RefreshToken'
import {db} from '../../Config/firestore'
import { Auth } from "../../Config/AuthContext";

function CreateZoomMeeting(props) {
  const { usuario } = useContext(Auth);
  const [token, setToken] = useState(null)

  useEffect(()=>{
    if (usuario) {
      var docRef = db.collection("Instructors").doc(usuario.email);
      docRef.get().then((doc)=>{
      if (doc.exists) {
          RefreshToken(usuario.email, doc.data().zoomRefreshToken)
        } else {
            console.log("No such document!");
        }
        }).catch(function(error) {
            console.log("Error getting document:", error);
        });
    }
  },[usuario])

   const setMeeting = () =>{
     var docRef = db.collection("Instructors").doc(usuario.email);
     docRef.get().then((doc)=>{

     if (doc.exists) {
           let url="http://localhost:9000/zoomAPI"

           let init = {
             method: 'POST',
             body: JSON.stringify({
              settings:{ topic: 'ya se guradan en firebase',
                       type: 2,
                       start_time: '2020-07-10T20:45:00',
                       timezone: 'America/Mexico_City',
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
      <button className='btn-lg btn-primary mt-2' onClick={setMeeting}> Agendar clase Zoom <CameraVideoFill /></button>
    </div>
  )
}

export default CreateZoomMeeting
