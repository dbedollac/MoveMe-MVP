import React from "react";
import { Auth } from "../../Config/AuthContext";
import './ClassCard.css'
import { CameraVideoFill } from 'react-bootstrap-icons';


function ClassCard(props) {

      return(
        <div className='card d-flex flex-column ClassCard-container'>
          {props.picture?<img src={props.picture} className='card-img-top'/>:
          <img src='/logo.jpg' className='card-img-top'/>}
          <div className='card-img-overlay-bottom ClassCard-titulo pt-2'>
            <p className='text-center px-1'>{props.title}</p>
          </div>
        </div>
      )
}
export default ClassCard
