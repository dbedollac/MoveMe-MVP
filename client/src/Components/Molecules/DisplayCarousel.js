import React, { useState, useContext, useEffect } from "react";
import ClassCard from '../Cards/ClassCard'
import CoachCard from '../Cards/CoachCard'
import Carousel from "react-multi-carousel";
import InstructorsDetailCard from '../Cards/InstructorsDetailCard'
import { X } from 'react-bootstrap-icons';
import "react-multi-carousel/lib/styles.css";

function DisplayCarousel(props) {
  const [meetings, setMeetings] = useState([])
  const [detail, setdetail] = useState(false)
  const [claseDetail, setclaseDetail] = useState(null)
  const [videoClases, setvideoClases] = useState(null)
  const [allInstructors, setallInstructors] = useState(null)

  const shuffleArray= (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array
    }

  const  handleDetail = (event) =>{
      if (props.home) {
        var clasesInstructor = props.allClases.filter(item => item.instructor.id.includes(event.target.name));
        var clase = clasesInstructor.filter(item => item.id.includes(event.target.alt))
      } else {
        var clase = props.allClases.filter(item => item.id.includes(event.target.name));
      }

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
      items: 6,
      slidesToSlide: 4
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 6,
      slidesToSlide: 4
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 4,
      slidesToSlide: 3
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 3,
      slidesToSlide: 3
    }
  };

  useEffect(()=>{
    if(props.zoomMeetings){
      if (meetings.length === 0) {

          var Meetings = []
          var now = new Date(Date.now()-3600000).toISOString()
            for (var i = 0; i < props.zoomMeetings.length; i++) {
              if (props.home) {
                var clasesInstructor = props.allClases.filter(item => item.instructor.id.includes(props.zoomMeetings[i].instructor.id));
                var clase = clasesInstructor.filter(item => item.id.includes(props.zoomMeetings[i].claseID))
              } else {
                var clase = props.allClases.filter(item => item.id.includes(props.zoomMeetings[i].claseID))
              }
              Meetings.push({startTime:props.zoomMeetings[i].startTime,
                meetingID: props.zoomMeetings[i].meetingID,
                id: clase[0].id,
                data: clase[0].data,
                instructor: props.zoomMeetings[i].instructor,
                monthlyProgram: props.zoomMeetings[i].monthlyProgram
              })
            }
        if (props.instructor&&!props.instructor.data.monthlyProgram.Active) {
          setMeetings(Meetings.filter(item => item.monthlyProgram===false))
        }else {
          setMeetings(Meetings)
        }
      }
    }

    if (props.home) {
      if (props.array) {setvideoClases(shuffleArray(props.array))}
      if(props.allInstructors){setallInstructors(shuffleArray(props.allInstructors))}
    }else {
      setvideoClases(props.array)
      setallInstructors(props.allInstructors)
    }

  },[props.array])

  if (detail&&claseDetail) {
    return(
      <div style={{position: 'relative'}} className='p-2'>
        <InstructorsDetailCard data={claseDetail.data} claseID={claseDetail.id} market={props.market?props.market:false} instructor={claseDetail.instructor?claseDetail.instructor:props.instructor}/>
        <X className='float-left'size={'2em'} onClick={handleDetail} style={{position: 'absolute', top:'2%', left:'2%',cursor:'pointer'}}/>
      </div>
    )
  }else{
  if (meetings.length===0&&!props.allInstructors&&!videoClases) {
    return <h4 style={{color:'gray'}} className='text-center py-5'><i>No se ha agendado ninguna clase por Zoom</i></h4>
  } else {
  return(
      <Carousel responsive={responsive}>
          {props.allInstructors?props.allInstructors.slice(0,50).map(item => (
              <div key={item.uid} style={{cursor:'pointer'}}>
                <CoachCard data={item.data} uid={item.uid}/>
              </div>
            ))
            :videoClases? videoClases.slice(0,50).map(item => (
            <div key={item.id} onClick={handleDetail} style={{cursor:'pointer'}}>
              <ClassCard title={item.data.title} picture={item.data.imgURL} name={item.instructor?item.instructor.id:item.id} id={item.id} price={item.data.offlinePrice}/>
            </div>
          )): meetings.sort(sortMeetings).slice(0,50).map(item => (
            <div key={item.id} onClick={handleDetail} style={{cursor:'pointer'}}>
              <ClassCard title={item.data.title} picture={item.data.imgURL} name={item.instructor?item.instructor.id:item.id} id={item.id} startTime={item.startTime} onClick={handleDetail} price={item.data.zoomPrice}/>
            </div>
          ))}
      </Carousel >
    )
  }
}
}

export default DisplayCarousel
