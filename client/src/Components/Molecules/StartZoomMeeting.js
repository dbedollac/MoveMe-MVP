import React, { useState, useContext, useEffect } from "react";
import {proxyurl} from '../../Config/proxyURL'
import {db} from '../../Config/firestore'
import { Auth } from "../../Config/AuthContext";
import { CameraVideoFill, PeopleFill } from 'react-bootstrap-icons';
import DeleteZoomMeeting from '../Atoms/DeleteZoomMeeting'
import AddToCar from '../Molecules/AddToCar'
import {UncontrolledPopover, PopoverHeader, PopoverBody } from 'reactstrap'
import { withRouter } from "react-router";
import {iva} from '../../Config/Fees'
import StripeFee from '../Atoms/StripeFee'

function StartZoomMeeting(props) {
  const { usuario } = useContext(Auth);
  const [dateTime, setdateTime] = useState(null)
  const [show, setShow] = useState(null)
  const zoomDate = new Date(props.startTime)
  const [claseTitle, setclaseTitle] = useState(null)
  const [time,setTime] = useState(null)
  const [price,setPrice] = useState(null)
  const [claseData,setclaseData] = useState(null)
  const [usersLength,setusersLength] = useState(null)
  const today = new Date()
  const now = new Date(Date.now()+3600000).toISOString()
  const now2 = new Date(Date.now()-3600000).toISOString()


  useEffect(()=>{


      if (!props.market&&props.sales) {
        if (props.zoomMonthlyProgram) {
          setusersLength(props.sales.filter(item=>item.type.includes('Reto')).filter(item=>item.expire>today.toISOString()).length+props.sales.filter(item=>item.type.includes('Zoom')).filter(item=>item.data.meetingID===props.meetingID).length)
        }else {
          setusersLength(props.sales.filter(item=>item.type.includes('Zoom')).filter(item=>item.data.meetingID===props.meetingID).length)
        }
     }

    if (zoomDate) {
      var days = zoomDate.getDate().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})
      var month = (zoomDate.getMonth()+1).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})
      var year = zoomDate.getFullYear()
      var hour = zoomDate.getHours().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})
      var minutes = zoomDate.getMinutes().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})


      setdateTime(hour+':'+minutes+'h'+' '+days+'/'+month+'/'+year)
      setTime(hour+':'+minutes+'h')
    }

    if(props.claseID){
      if (props.ClasesZoom) {
        var docRef = db.collection("Instructors").doc(props.instructor.id);
        docRef.collection('Classes').doc(props.claseID)
            .get()
            .then( doc =>
                setclaseTitle(doc.data().title)
            )
            .catch(function(error) {
                console.log("Error getting documents: ", error);
            });
      }else{
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
    }

    if (props.market&&props.claseID) {
      var docRef = db.collection("Instructors").doc(props.match.params.uid?props.match.params.uid:props.instructor?props.instructor.id:usuario.uid);
      docRef.collection('Classes').doc(props.claseID)
          .get()
          .then( doc =>{
              setPrice((doc.data().zoomPrice*(1+iva)+StripeFee(doc.data().zoomPrice*(1+iva))).toFixed(2))
              setclaseData(doc.data())
            }
          )
          .catch(function(error) {
              console.log("Error getting documents: ", error);
          });
    }

  },[usuario])

  const startMeeting = () =>{
    if (!props.ClasesZoom) {

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
   }else {
     window.location.href = props.joinURL
   }
  }


  return(
    <div className={`card card-link d-flex flex-column flex-lg-row align-items-center justify-content-around py-1`} style={{backgroundColor: `${props.startTime===props.detailStartTime?'lightblue':'white'}`}}>
      <div className={`d-flex flex-row align-items-center justify-content-around ${props.monthlyProgram?'col-lg-6':null}`}>
        {usersLength!==null?
          <div className='d-flex flex-row align-items-center mr-2'>
              <PeopleFill size={'20px'}/>
              <p className='pt-3 ml-1'>{usersLength}</p>
          </div>:null}
        {props.monthlyProgram?<p className='pt-3'>{!props.fitnessKit& props.market?'$'+price:null} {time} {claseTitle}</p>:<p className='mt-3'>{props.market?'$'+price:null} {dateTime}</p>}
      </div>

      {props.fitnessKit&&props.market?null:
        <div className='d-flex flex-row align-items-center justify-content-center col-12 col-lg-6'>
        {props.market?<AddToCar claseZoom={claseData}
          instructor={props.instructor}
          meetingID={props.meetingID}
          startTime={{time:dateTime,startTime:props.startTime}}
          joinURL={props.joinURL}
          claseID={props.claseID}
          zoomMonthlyProgram={props.zoomMonthlyProgram}
          trialClass={props.instructor.data.disableTrialClasses?-1:props.trialClass}
          />
        :<button
          className={`rounded btn${props.startTime>now||props.startTime<now2?'-outline-secondary':'-primary'}`}
          onClick={startMeeting}
          disabled={(props.startTime>now||props.startTime<now2)}
          >{props.monthlyProgram?<CameraVideoFill />:null} {props.title}</button>}

          {props.market||props.ClasesZoom?null:<div className='col-1 float-right'><DeleteZoomMeeting meetingID={props.meetingID} meetingTitle={claseTitle} meetingTime={time} /></div>}
        </div>}
    </div>
  )
}

export default withRouter(StartZoomMeeting)
