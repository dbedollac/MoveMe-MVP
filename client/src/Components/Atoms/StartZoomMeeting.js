import React, { useState, useContext, useEffect } from "react";
import {proxyurl} from '../../Config/proxyURL'
import {db} from '../../Config/firestore'
import { Auth } from "../../Config/AuthContext";

function StartZoomMeeting(props) {
  const { usuario } = useContext(Auth);
  const [dateTime, setdateTime] = useState(null)
  const [show, setShow] = useState(null)
  const zoomDate = new Date(props.startTime)

  useEffect(()=>{
    if (zoomDate) {
      var days = zoomDate.getDate().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})
      var month = (zoomDate.getMonth()+1).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})
      var year = zoomDate.getFullYear()
      var hour = zoomDate.getHours().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})
      var minutes = zoomDate.getMinutes().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})

      if (minutes===0) {
        minutes='00'
      }

      setdateTime(hour+':'+minutes+' '+days+'/'+month+'/'+year)
    }

  })

  const startMeeting = () =>{
    var docRef = db.collection("Instructors").doc(usuario.email);
    docRef.get().then((doc)=>{

    if (doc.exists) {
          let url=proxyurl+"zoomAPI/getdata"

          let init = {
            method: 'POST',
            body: JSON.stringify({
                 token: doc.data().zoomToken,
                 meetingID:props.meetingID
             }),
             headers: {
               "content-type": "application/json"
             }
          }

          fetch(url,init).then((response)=>{
              Promise.resolve(response.json()).then( (resp) =>{
                console.log(resp);
                window.location.href = resp.start_url
              }

              )
          }, function(error) {
              console.log(error.message)
              window.location.reload(false)
          })

        } else {
         console.log("No such document!");
     }
     }).catch(function(error) {
         console.log("Error getting document:", error);
     });
     }

  return(
    <div className='card card-link d-flex flex-row align-items-center justify-content-around'>
      <p className='mt-2'>{dateTime}</p>
      <button className='btn-primary col-6' onClick={startMeeting}>{props.title}</button>
    </div>
  )
}

export default StartZoomMeeting
