import React from 'react'
import { withRouter } from "react-router";

import './CoachName.css'

function CoachName(props) {

  const handleClick = () =>{
    props.history.push(`/coach-${props.profileName.replace(/ /g,'-')}/${props.uid}`)
  }

  return(
    <div className='d-flex flex-row align-items-center CoachName-container' onClick={handleClick} style={{cursor:'pointer'}}>
      {props.profilePicture?<img src={props.profilePicture} className='rounded-circle'/>:
      <img src='/logo.jpg' className='rounded-circle'/>}
      <h4 style={{color: 'gray'}}>Coach {props.profileName}</h4>
    </div>
  )
}

export default withRouter(CoachName)
