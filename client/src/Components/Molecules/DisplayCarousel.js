import React, { useState, useContext, useEffect } from "react";
import ClassCard from '../Cards/ClassCard'
import Carousel from "react-multi-carousel";
import InstructorsDetailCard from '../Cards/InstructorsDetailCard'
import { X } from 'react-bootstrap-icons';
import "react-multi-carousel/lib/styles.css";

function DisplayCarousel(props) {
  const [meetings, setMeetings] = useState([])
  const [detail, setdetail] = useState(false)
  const [claseDetail, setclaseDetail] = useState(null)

  const  handleDetail = (event) =>{
      var clase = props.allClases.filter(item => item.id.includes(event.target.name));
      setclaseDetail(clase[0])
      setdetail(!detail)
    }

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

  const responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 3000 },
      items: 6
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 6
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 4
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 3
    }
  };

  useEffect(()=>{
    if(props.zoomMeetings){
      if (meetings.length === 0) {

          var Meetings = []
          var now = new Date(Date.now()-3600000).toISOString()
            for (var i = 0; i < props.zoomMeetings.length; i++) {
              var clase = props.allClases.filter(item => item.id.includes(props.zoomMeetings[i].claseID))
              Meetings.push({startTime:props.zoomMeetings[i].startTime,
                meetingID: props.zoomMeetings[i].meetingID,
                id: clase[0].id,
                data: clase[0].data})
            }
        setMeetings(Meetings)
      }
    }
  },[meetings])

  if (detail) {
    return(
      <div style={{position: 'relative'}} className='p-2'>
        <InstructorsDetailCard data={claseDetail.data} claseID={claseDetail.id}/>
        <X className='float-left'size={'2em'} onClick={handleDetail} style={{position: 'absolute', top:'2%', left:'2%',cursor:'pointer'}}/>
      </div>
    )
  }else{
  return(
      <Carousel responsive={responsive}>
          {props.array? props.array.map(item => (
            <div key={item.id} onClick={handleDetail} style={{cursor:'pointer'}}>
              <ClassCard title={item.data.title} picture={item.data.imgURL} name={item.id}/>
            </div>
          )): meetings.sort(sortMeetings).map(item => (
            <div key={item.id} onClick={handleDetail} style={{cursor:'pointer'}}>
              <ClassCard title={item.data.title} picture={item.data.imgURL} name={item.id} startTime={item.startTime} onClick={handleDetail}/>
            </div>
          ))}
      </Carousel >
    )
  }
}

export default DisplayCarousel
