import React,{useEffect, useState} from 'react'
import { withRouter } from "react-router";
import {db} from '../../Config/firestore'

function CoachCard(props) {
  const [videosNumber, setvideosNumber] = useState(null)
  const [zoomMeetingsNumber, setZoomMeetingsNumber] = useState(null)

  const handleClick = () =>{
    props.history.push(`/coach-${props.data.profileName.replace(/ /g,'-')}/${props.uid}`)
  }

  useEffect(()=>{
    var docRef = db.collection("Instructors").doc(props.uid)

    docRef.collection('ZoomMeetingsID').where("monthlyProgram", "==", true)
        .get()
        .then(snap => setZoomMeetingsNumber(snap.size))
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
      <p className='card-title text-center'><strong>${props.data.monthlyProgram.Price} {props.data.profileName}</strong></p>
      {props.data.imgURL?<img src={props.data.imgURL} className='card-img-top rounded-circle'/>:
      <img src='/logo.jpg' className='card-img-top'/>}
      <div className='card-img-overlay-bottom ClassCard-titulo d-flex flex-column justify-content-around'>
        <p className='text-center px-1' >{zoomMeetingsNumber} Clases por Zoom</p>
        <p className='text-center px-1' >{videosNumber} Clases en Video</p>
      </div>
    </div>
  )
}

export default withRouter(CoachCard)
