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
        var ref = docRef.collection('ZoomMeetingsID').where("claseID", "==", props.claseID)

        ref.get()
            .then(function(querySnapshot) {
              var now = props.startTime?props.startTime:new Date(Date.now()-3600000).toISOString()
                querySnapshot.forEach(function(doc) {
                  if(doc.data().startTime>=now){
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

      if (props.dayDate&&!props.zoomMeetings) {
        var zoomMeetings = []
        var docRef = db.collection("Instructors").doc(props.match.params.uid?props.match.params.uid:props.instructor?props.instructor.id:usuario.uid);
        var ref = docRef.collection('ZoomMeetingsID').where("monthNumber", "==", (props.dayDate.getMonth()+1).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})).where("dayNumber", "==", props.dayDate.getDate().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false}))

        ref.get()
            .then(function(querySnapshot) {
              var now = props.startTime?props.startTime:new Date(Date.now()-3600000).toISOString()
                querySnapshot.forEach(function(doc) {
                  if(doc.data().startTime>=now){
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
        },[props.zoomMeetings,usuario,props.dayDate])

  return(
      <div>
        {meetings.length===0&&!props.zoomMeetings?<h6 style={{color: 'gray'}} className='ml-1'><i>{t('startZoom.10','No se han agendado clases por Zoom')}</i></h6>:null}
        {meetings.length>0?meetings.sort(sortMeetings).map((meeting,index) => (
        <div key={meeting.meetingID+index}>
          <StartZoomMeeting
          startTime={meeting.startTime}
          title={props.zoomMeetings?t('startZoom.1','Unirme'):t('startZoom.2','Iniciar')}
          meetingID={meeting.meetingID}
          monthlyProgram={props.dayDate?true:false}
          claseID={meeting.claseID}
          market={props.match.params.uid||props.market?true:false}
          instructor={props.zoomMeetings?meeting.instructor:props.instructor}
          joinURL={meeting.joinURL}
          zoomMonthlyProgram={meeting.monthlyProgram}
          ClasesZoom={props.zoomMeetings?true:false}
          trialClass={props.usertrialClass}
          sales={sales}
          detailStartTime={props.claseID?props.startTime:false}
          fitnessKit={props.dayDate?true:false}
          />
        </div>
      )):props.zoomMeetings?props.zoomMeetings.sort(sortMeetings).map((meeting,index) => (
      <div key={meeting.meetingID+index}>
        <StartZoomMeeting
        startTime={meeting.startTime}
        title={props.zoomMeetings?t('startZoom.1','Unirme'):t('startZoom.2','Iniciar')}
        meetingID={meeting.meetingID}
        monthlyProgram={props.dayDate?true:false}
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
