import React, { useState, useContext, useEffect } from "react";
import './ClassCard.css'


function ClassCard(props) {
  const [time,setTime] = useState(null)

  useEffect(()=>{
    if (props.startTime) {
      const zoomDate = new Date(props.startTime)
      var days = zoomDate.getDate().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})
      var month = (zoomDate.getMonth()+1).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})
      var year = zoomDate.getFullYear()
      var hour = zoomDate.getHours().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})
      var minutes = zoomDate.getMinutes().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})


      setTime(hour+':'+minutes+'h'+' '+days+'/'+month+'/'+year)
    }

    if (props.expire) {
      const zoomDate = new Date(props.expire)
      var days = zoomDate.getDate().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})
      var month = (zoomDate.getMonth()+1).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})
      var year = zoomDate.getFullYear()


      setTime(days+'/'+month+'/'+year)
    }
  })

      return(
        <div className='card d-flex flex-column ClassCard-container'>
          {props.picture?<img src={props.picture} className='card-img-top' name={props.name} alt={props.id} id={props.joinURL}/>:
          <img src='/logo.jpg' className='card-img-top' name={props.name} alt={props.id} id={props.joinURL}/>}
          <div className=' ClassCard-titulo d-flex flex-column justify-content-around' >
            <p className='text-center px-1' >{props.price?props.price>-1&&!props.misVideos?props.freeVideo?'$0':'$'+props.price:null:null} {props.title}</p>
            {props.startTime?<p className='text-center px-1' >{time}</p>:null}
            {props.expire?<p className='text-center px-1' >Expira: {time}</p>:null}
          </div>
        </div>
      )
}
export default ClassCard
