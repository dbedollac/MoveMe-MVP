import React, { useState, useContext, useEffect } from "react";
import {db} from '../../Config/firestore'
import { Auth } from "../../Config/AuthContext";
import StartZoomMeeting from '../Molecules/StartZoomMeeting'
import { withRouter } from "react-router";
import { useTranslation } from 'react-i18next';

function GetZoomMeetings(props) {
  var { usuario } = useContext(Auth);
  const [meetings, setMeetings] = useState([])
  const [sales,setSales] = useState([])
  const { t } = useTranslation();

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

  useEffect( ()=>{

    if (usuario||props.match.params.uid||props.instructor) {

      if (usuario&&!props.market&&!props.match.params.uid) {
        var Sales = []
        db.collection('Sales').where('instructor.uid','==',usuario.uid).get()
            .then(function(querySnapshot) {
                querySnapshot.forEach(function(doc) {
                  Sales.push(doc.data())
                })
                setSales(Sales)
            })
            .catch(function(error) {
                console.log("Error getting documents: ", error);
            });
      }


      if (meetings.length === 0) {
      if (props.claseID) {
        var zoomMeetings = []
        var docRef = db.collection("Instructors").doc(props.match.params.uid?props.match.params.uid:props.instructor?props.instructor.id:usuario.uid);
        if (props.instructor&&!props.instructor.data.monthlyProgram.Active) {
          var ref = docRef.collection('ZoomMeetingsID').where("claseID", "==", props.claseID).where('monthlyProgram','==',false)
        } else {
          var ref = docRef.collection('ZoomMeetingsID').where("claseID", "==", props.claseID)
        }
        ref.get()
            .then(function(querySnapshot) {
              var now = new Date(Date.now()-3600000).toISOString()
                querySnapshot.forEach(function(doc) {
                  if(doc.data().startTime>now){
                  zoomMeetings.push({startTime:doc.data().startTime,
                    meetingID:doc.data().meetingID,
                    claseID:doc.data().claseID,
                    joinURL:doc.data().joinURL,
                    monthlyProgram:doc.data().monthlyProgram})
                  }
                })
                setMeetings(zoomMeetings)
            })
            .catch(function(error) {
                console.log("Error getting documents: ", error);
            });
      }

      if (props.week&&!props.zoomMeetings) {
        var zoomMeetings = []
        var docRef = db.collection("Instructors").doc(props.match.params.uid?props.match.params.uid:props.instructor?props.instructor.id:usuario.uid);
        if (props.instructor&&!props.instructor.data.monthlyProgram.Active) {
          var ref = docRef.collection('ZoomMeetingsID').where("week", "==", props.week).where("dayNumber", "==", props.dayNumber).where('monthlyProgram','==',false)
        } else {
          var ref = docRef.collection('ZoomMeetingsID').where("week", "==", props.week).where("dayNumber", "==", props.dayNumber)
        }
        ref.get()
            .then(function(querySnapshot) {
              var now = new Date(Date.now()-3600000).toISOString()
                querySnapshot.forEach(function(doc) {
                  if(doc.data().startTime>now){
                  zoomMeetings.push({startTime:doc.data().startTime,
                    meetingID:doc.data().meetingID,
                    claseID:doc.data().claseID,
                    joinURL:doc.data().joinURL,
                    monthlyProgram:doc.data().monthlyProgram}
                  )}
                })
                setMeetings(zoomMeetings)
            })
            .catch(function(error) {
                console.log("Error getting documents: ", error);
            });
      }
    }

          }
        },[props.zoomMeetings,usuario])

  return(
      <div>
        {meetings.length===0&&!props.zoomMeetings?<h5 style={{color: 'gray'}} className='ml-1'><i>No se han agendado clases por Zoom</i></h5>:null}
        {meetings.length>0?meetings.sort(sortMeetings).map((meeting,index) => (
        <div key={meeting.meetingID+index}>
          <StartZoomMeeting
          startTime={meeting.startTime}
          title={props.zoomMeetings?t('startZoom.1','Unirme'):t('startZoom.1','Iniciar')}
          meetingID={meeting.meetingID}
          monthlyProgram={props.week?true:false}
          claseID={meeting.claseID}
          market={props.match.params.uid||props.market?true:false}
          instructor={props.zoomMeetings?meeting.instructor:props.instructor}
          joinURL={meeting.joinURL}
          zoomMonthlyProgram={meeting.monthlyProgram}
          ClasesZoom={props.zoomMeetings?true:false}
          trialClass={props.usertrialClass}
          sales={sales}
          detailStartTime={props.claseID?props.startTime:false}/>
        </div>
      )):props.zoomMeetings?props.zoomMeetings.sort(sortMeetings).map((meeting,index) => (
      <div key={meeting.meetingID+index}>
        <StartZoomMeeting
        startTime={meeting.startTime}
        title={props.zoomMeetings?t('startZoom.1','Unirme'):t('startZoom.1','Iniciar')}
        meetingID={meeting.meetingID}
        monthlyProgram={props.week?true:false}
        claseID={meeting.claseID}
        market={props.match.params.uid||props.market?true:false}
        instructor={props.zoomMeetings?meeting.instructor:props.instructor}
        joinURL={meeting.joinURL}
        zoomMonthlyProgram={meeting.monthlyProgram}
        ClasesZoom={props.zoomMeetings?true:false}/>
      </div>)):null
      }
    </div>
  )
}

export default withRouter(GetZoomMeetings)
