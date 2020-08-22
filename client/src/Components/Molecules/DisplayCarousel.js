import React, { useState, useContext, useEffect } from "react";
import ClassCard from '../Cards/ClassCard'
import CoachCard from '../Cards/CoachCard'
import Carousel from "react-multi-carousel";
import InstructorsDetailCard from '../Cards/InstructorsDetailCard'
import { X } from 'react-bootstrap-icons';
import UsersDetailCard from '../Cards/UsersDetailCard'
import { Spinner} from 'react-bootstrap'
import "react-multi-carousel/lib/styles.css";

function DisplayCarousel(props) {
  const [meetings, setMeetings] = useState([])
  const [detail, setdetail] = useState(false)
  const [claseDetail, setclaseDetail] = useState(null)
  const [videoClases, setvideoClases] = useState(null)
  const [allInstructors, setallInstructors] = useState(null)
  const [loading,setLoading] = useState(true)
  setInterval(()=>{setLoading(false)},10000)

  const shuffleArray= (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array
    }

  const  handleDetail = (event) =>{
      if (props.home||props.ClasesZoom) {
        var clasesInstructor = props.allClases.filter(item => item.instructor.id.includes(event.target.name));
        var clase = {data:clasesInstructor.filter(item => item.id.includes(event.target.alt))[0],joinURL:props.ClasesZoom?event.target.id:null}
      } else {
        var clase = {data:props.allClases.filter(item => item.id.includes(event.target.name))[0]}
      }

      setclaseDetail(clase)
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

          var Meetings = []
          var now = new Date(Date.now()-3600000).toISOString()
            for (var i = 0; i < props.zoomMeetings.length; i++) {
              if (props.home||props.ClasesZoom) {
                var clase = props.allClases.filter(item => item.instructor.id===props.zoomMeetings[i].instructor.id).filter(item => item.id===props.zoomMeetings[i].claseID)
              } else {
                var clase = props.allClases.filter(item => item.id===props.zoomMeetings[i].claseID)
              }
              Meetings.push({startTime:props.zoomMeetings[i].startTime,
                meetingID: props.zoomMeetings[i].meetingID,
                id: clase[0].id,
                data: clase[0].data,
                instructor: props.zoomMeetings[i].instructor,
                monthlyProgram: props.zoomMeetings[i].monthlyProgram,
                joinURL:props.zoomMeetings[i].joinURL
              })
            }
        if (props.instructor&&!props.instructor.data.monthlyProgram.Active) {
          setMeetings(Meetings.filter(item => item.monthlyProgram===false))
        }else {
          setMeetings(Meetings)
        }

    }

    if (props.home) {
      if (props.array) {setvideoClases(shuffleArray(props.array))}
      if(props.allInstructors){setallInstructors(shuffleArray(props.allInstructors))}
    }else {
      setvideoClases(props.array)
      setallInstructors(props.allInstructors)
    }

  },[props.array,props.zoomMeetings])

  if (detail&&claseDetail.data) {
    return(
      <div style={{position: 'relative'}} className='p-2'>
      {props.ClasesZoom?<UsersDetailCard data={claseDetail.data.data} claseID={claseDetail.data.id} instructor={claseDetail.data.instructor?claseDetail.data.instructor:props.instructor} ClasesZoom={true} joinURL={claseDetail.joinURL}/>
      :<InstructorsDetailCard data={claseDetail.data.data} claseID={claseDetail.data.id} market={props.market?props.market:false} instructor={claseDetail.data.instructor?claseDetail.data.instructor:props.instructor}/>}
        <X className='float-left'size={'2em'} onClick={handleDetail} style={{position: 'absolute', top:'2%', left:'2%',cursor:'pointer'}}/>
      </div>
    )
  }else{
  if (meetings.length===0&&!props.allInstructors&&!videoClases) {
    if (loading) {
      return <div className='text-center'><Spinner animation="border" /></div>
    } else {
      return <h4 style={{color:'gray'}} className='text-center px-2'><i>No se ha agendado ninguna clase por Zoom</i></h4>
    }
  } else {
  return(
      <Carousel responsive={responsive}>
          {props.allInstructors?props.allInstructors.slice(0,50).map((item,index) => (
              <div key={item.uid+index} style={{cursor:'pointer'}}>
                <CoachCard data={item.data} uid={item.uid}/>
              </div>
            ))
            :videoClases? videoClases.slice(0,50).map((item,index) => (
            <div key={item.id+index} onClick={handleDetail} style={{cursor:'pointer'}}>
              <ClassCard title={item.data.title} picture={item.data.imgURL} name={item.instructor?item.instructor.id:item.id} id={item.id} price={item.data.offlinePrice} freeVideo={item.data.freeVideo?true:false}/>
            </div>
          )): meetings.sort(sortMeetings).slice(0,50).map((item,index) => (
            <div key={item.id+index} onClick={handleDetail} style={{cursor:'pointer'}}>
              <ClassCard title={item.data.title}
                picture={item.data.imgURL}
                name={item.instructor?item.instructor.id:item.id}
                id={item.id}
                startTime={item.startTime}
                price={!props.ClasesZoom?item.data.zoomPrice:null}
                joinURL={props.ClasesZoom?item.joinURL:null}
                />
            </div>
          ))}
      </Carousel >
    )
  }
}
}

export default DisplayCarousel
