import React, { useState, useContext, useEffect } from "react";
import {proxyurl} from '../../Config/proxyURL'
import {db} from '../../Config/firestore'
import { Auth } from "../../Config/AuthContext";
import { CameraVideoFill } from 'react-bootstrap-icons';
import DeleteZoomMeeting from '../Atoms/DeleteZoomMeeting'
import AddToCar from '../Atoms/AddToCar'
import { withRouter } from "react-router";


function StartZoomMeeting(props) {
  const { usuario } = useContext(Auth);
  const [dateTime, setdateTime] = useState(null)
  const [show, setShow] = useState(null)
  const zoomDate = new Date(props.startTime)
  const [claseTitle, setclaseTitle] = useState(null)
  const [time,setTime] = useState(null)
  const [price,setPrice] = useState(null)

  useEffect(()=>{

    if (zoomDate) {
      var days = zoomDate.getDate().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})
      var month = (zoomDate.getMonth()+1).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})
      var year = zoomDate.getFullYear()
      var hour = zoomDate.getHours().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})
      var minutes = zoomDate.getMinutes().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})


      setdateTime(hour+':'+minutes+'h'+' '+days+'/'+month+'/'+year)
      setTime(hour+':'+minutes+' h')
    }

    if(props.claseID){
      var docRef = db.collection("Instructors").doc(props.match.params.uid?props.match.params.uid:props.instructor?props.instructor.id:usuario.uid);
      docRef.collection('Classes').doc(props.claseID)
          .get()
          .then( doc =>
              setclaseTitle(doc.data().title)
          )
          .catch(function(error) {
              console.log("Error getting documents: ", error);
          });
    }

    if (props.market&&props.claseID) {
      var docRef = db.collection("Instructors").doc(props.match.params.uid?props.match.params.uid:props.instructor?props.instructor.id:usuario.uid);
      docRef.collection('Classes').doc(props.claseID)
          .get()
          .then( doc =>
              setPrice(doc.data().zoomPrice)
          )
          .catch(function(error) {
              console.log("Error getting documents: ", error);
          });
    }

  })

  const startMeeting = () =>{
    var docRef = db.collection("Instructors").doc(usuario.uid);
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
      {props.monthlyProgram? props.market?null:<div className='col-1'><DeleteZoomMeeting meetingID={props.meetingID} meetingTitle={claseTitle} meetingTime={time} /></div>:null}
      {props.monthlyProgram?<p className='mt-2 col-7'>{props.market?'$'+price:null} {time} {claseTitle}</p>:<p className='mt-2'>{props.market?'$'+price:null} {dateTime}</p>}
      {props.market?<AddToCar />
      :<button className='btn-primary' onClick={startMeeting}>{props.monthlyProgram?<CameraVideoFill />:null} {props.title}</button>}
    </div>
  )
}

export default withRouter(StartZoomMeeting)
