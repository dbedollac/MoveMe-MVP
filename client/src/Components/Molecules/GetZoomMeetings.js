import React, { useState, useContext, useEffect } from "react";
import {db} from '../../Config/firestore'
import { Auth } from "../../Config/AuthContext";
import StartZoomMeeting from '../Atoms/StartZoomMeeting'

function GetZoomMeetings(props) {
  const { usuario } = useContext(Auth);
  const [meetings, setMeetings] = useState([])

  const sortMeetings = (a,b) => {
    const meetingA = a.startTime;
    const meetingB = b.startTime;

    let comparison = 0;
    if (meetingA > meetingB) {
      comparison = 1;
    } else if (meetingA < meetingB) {
      comparison = -1;
    }
    return comparison;
  }

  useEffect(()=>{
    if (usuario) {
      if (meetings.length === 0) {
      if (props.claseID) {
        var zoomMeetings = []
        var docRef = db.collection("Instructors").doc(usuario.uid);
        docRef.collection('ZoomMeetingsID').where("claseID", "==", props.claseID).get()
            .then(function(querySnapshot) {
              var now = new Date(Date.now()-3600000).toISOString()
                querySnapshot.forEach(function(doc) {
                  if(doc.data().startTime>now){
                  zoomMeetings.push({startTime:doc.data().startTime,meetingID:doc.data().meetingID})}
                })
                setMeetings(zoomMeetings)
            })
            .catch(function(error) {
                console.log("Error getting documents: ", error);
            });
      }

      if (props.week) {
        var zoomMeetings = []
        var docRef = db.collection("Instructors").doc(usuario.uid);
        docRef.collection('ZoomMeetingsID').where("week", "==", props.week).where("dayNumber", "==", props.dayNumber)
            .get()
            .then(function(querySnapshot) {
              var now = new Date(Date.now()-3600000).toISOString()
                querySnapshot.forEach(function(doc) {
                  if(doc.data().startTime>now){
                  zoomMeetings.push({startTime:doc.data().startTime,meetingID:doc.data().meetingID,claseID:doc.data().claseID})}
                })
                setMeetings(zoomMeetings)
            })
            .catch(function(error) {
                console.log("Error getting documents: ", error);
            });
      }

    }
          }
        })

  return(
      <div>
        {meetings?meetings.sort(sortMeetings).map(meeting => (
        <div key={meeting.meetingID}>
          <StartZoomMeeting
          startTime={meeting.startTime}
          title='Iniciar'
          meetingID={meeting.meetingID}
          monthlyProgram={props.week?true:false}
          claseID={meeting.claseID}/>
        </div>
      )):null}
    </div>
  )
}

export default GetZoomMeetings
