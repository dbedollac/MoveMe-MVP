import React from "react";
import './ClassCard.css'


function ClassCard(props) {

      return(
        <div className='card d-flex flex-column ClassCard-container'>
          {props.picture?<img src={props.picture} className='card-img-top' name={props.name}/>:
          <img src='/logo.jpg' className='card-img-top' name={props.name}/>}
          <div className='card-img-overlay-bottom ClassCard-titulo pt-2'>
            <p className='text-center px-1' name={props.name}>{props.title}</p>
          </div>
        </div>
      )
}
export default ClassCard
