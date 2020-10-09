import React,{useEffect, useState} from 'react'
import { withRouter } from "react-router";
import {db} from '../../Config/firestore'
import { useTranslation } from 'react-i18next';
import './ClassCard.css'
import {iva} from '../../Config/Fees'
import StripeFee from '../Atoms/StripeFee'

function CoachCard(props) {
  const [videosNumber, setvideosNumber] = useState(null)
  const [zoomMeetingsNumber, setZoomMeetingsNumber] = useState(null)
  const { t } = useTranslation();
  const today = new Date()
  const firstMonthDay = new Date(today.getFullYear(),today.getMonth(),1)
  const firstMonthSunday = firstMonthDay.getDay()===0?0:7-firstMonthDay.getDay()+1
  const fiveWeeks = (new Date(today.getFullYear(),today.getMonth(),firstMonthSunday+28).getMonth() === today.getMonth())
  const fiveWeeks0= fiveWeeks?-2:0

  const handleClick = () =>{
    props.history.push(`/coach-${props.data.profileName.replace(/ /g,'-')}/${props.uid}`)
  }

  useEffect(()=>{
    var docRef = db.collection("Instructors").doc(props.uid)


    docRef.collection('ZoomMeetingsID').get()
          .then(function(querySnapshot) {
            var now = new Date(Date.now()-3600000).toISOString()
            var Meetings = []
              querySnapshot.forEach(function(doc) {
                  if (doc.data().startTime>now) {
                    Meetings.push(doc.id)
                  }
              }
            )
            setZoomMeetingsNumber(Meetings.length)
          })
        .catch(function(error) {
            console.log("Error getting documents: ", error);
        })

    docRef.collection('Classes').where("videoURL", ">=", "")
        .get()
        .then(snap => setvideosNumber(snap.size))
        .catch(function(error) {
              console.log("Error getting documents: ", error);
        })
  })

  return(
      <div className='card d-flex flex-column ClassCard-container' onClick={handleClick}>
        <p className='card-title text-center'><strong>${Math.ceil(props.data.monthlyProgram.Price*(1+iva)+StripeFee(props.data.monthlyProgram.Price*(1+iva)))} {props.data.profileName}</strong></p>
        {props.data.imgURL?<img src={props.data.imgURL} className='card-img-top rounded-circle'/>:
        <img src='/logo.jpg' className='card-img-top'/>}
        <div className='card-img-overlay-bottom ClassCard-titulo d-flex flex-column justify-content-around'>
          <p className='text-center px-1' >{zoomMeetingsNumber>0? zoomMeetingsNumber +' '+ t('classCard.2','Clases por Zoom'):null}</p>
          <p className='text-center px-1' >{videosNumber>0? videosNumber +' '+ t('classCard.3','Clases en Video'):null}</p>
        </div>
      </div>
  )
}

export default withRouter(CoachCard)
