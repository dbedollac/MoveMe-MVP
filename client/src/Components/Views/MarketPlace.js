import React, {useState,useEffect,useContext} from 'react';
import Header from '../Molecules/Header'
import { Auth } from "../../Config/AuthContext";
import {db, auth} from '../../Config/firestore'
import { withRouter } from "react-router";
import DisplayCarousel from '../Molecules/DisplayCarousel'
import MarketAllClasses from './MarketAllClasses'
import { CameraVideoFill } from 'react-bootstrap-icons';
import './MarketPlace.css'

function MarketPlace(props) {
  const { usuario } = useContext(Auth);
  const [allClases, setallClases] = useState([])
  const [videoClases, setvideoClases] = useState([])
  const [zoomMeetings,setZoomMeetings] = useState([])
  const [allInstructors, setallInstructors] = useState([])
  const [verClasesZoom, setverClasesZoom] = useState(false)
  const [verClasesVideo, setverClasesVideo] = useState(true)

  const handleVerClasesZoom = () =>{
    setverClasesZoom(!verClasesZoom)
  }

  const handleVerClasesVideo = () =>{
    setverClasesVideo(!verClasesVideo)
  }

  const handleVerProgramas = () =>{
    console.log('ver programa')
  }

  useEffect(()=>{
    if (props.return) {
      if (props.return.includes('coach')) {
        props.history.push(props.return)
      }
    }

    if (props.location.state) {
      if (props.location.state[0].includes('coach')) {
        props.history.push(props.location.state[0])
      }
    }

    var docRef = db.collection("Instructors")

    if (allInstructors.length===0) {
      docRef.where('monthlyProgram.Active','==',true).get().then((querySnapshot) => {
        querySnapshot.forEach((instructor) => {
          allInstructors.push({uid:instructor.id, data:instructor.data()})
      })
    }).catch(function(error) {
        console.log("Error getting documents: ", error);
    })
  }


    if (allClases.length===0) {
     docRef.get().then((querySnapshot) => {
                        querySnapshot.forEach((instructor) => {
                          var ref=docRef.doc(instructor.id)
                          ref.collection('Classes')
                                         .get()
                                         .then((querySnapshot) => {
                                             querySnapshot.forEach((doc) => {
                                                  allClases.push({instructor:{id:instructor.id,data:instructor.data()},id:doc.id, data: doc.data()});
                                             });
                                             setvideoClases(allClases.filter(item => item.data.videoURL!==undefined))
                                         })
                                         .catch(function(error) {
                                             console.log("Error getting documents: ", error);
                                         })
                        });
                    })
                    .catch(function(error) {
                        console.log("Error getting documents: ", error);
                    })}

    if (zoomMeetings.length===0) {
      docRef.get().then((querySnapshot) => {
                        var Meetings = []
                         querySnapshot.forEach((instructor) => {
                           var ref=docRef.doc(instructor.id)
                           ref.collection('ZoomMeetingsID')
                                          .get()
                                          .then((querySnapshot) => {
                                          setZoomMeetings(zoomMeetings)
                                          var now = new Date(Date.now()-3600000).toISOString()
                                              querySnapshot.forEach((doc) => {
                                                if(doc.data().startTime>now){
                                                  if (instructor.data().monthlyProgram.Active) {
                                                    Meetings.push({
                                                    startTime:doc.data().startTime,
                                                    meetingID:doc.data().meetingID,
                                                    claseID:doc.data().claseID,
                                                    monthlyProgram:doc.data().monthlyProgram,
                                                    instructor:{id:instructor.id,data:instructor.data()}

                                                })}else {
                                                  if (!doc.data().monthlyProgram) {
                                                    Meetings.push({
                                                    startTime:doc.data().startTime,
                                                    meetingID:doc.data().meetingID,
                                                    claseID:doc.data().claseID,
                                                    monthlyProgram:doc.data().monthlyProgram,
                                                    instructor:{id:instructor.id,data:instructor.data()}
                                                    })
                                                  }
                                                }
                                              }
                                            })
                                              setZoomMeetings(Meetings)
                                          })
                                          .catch(function(error) {
                                              console.log("Error getting documents: ", error);
                                          })
                         });
                     })
                     .catch(function(error) {
                         console.log("Error getting documents: ", error);
                     })
                   }


  },[allClases])
    if (verClasesZoom) {
      return (
        <>
          <Header  user={usuario?true:false}/>
          <div className='MarketPlace-container'>
            <MarketAllClasses allClases={allClases} zoomMeetings={zoomMeetings}/>
          </div>
        </>
      )
    }

    return (
      <div>
        <Header  user={usuario?true:false}/>
        <div className='MarketPlace-container'>
          <div className='d-flex flex-row'>
              <div className='col-8 d-flex flex-row alig-items-center justify-content-start'>
                  <h3>Programas Mensuales</h3>
                </div>
                <div className='col-4 d-flex flex-row alig-items-center justify-content-end'>
                <i onClick={handleVerProgramas} style={{cursor:'pointer',fontSize:'large'}}>Ver todos los programas</i>
              </div>
          </div>
            {allInstructors.length>0?
            <DisplayCarousel allInstructors={allInstructors} market={true} home={true}/>:
            <h4 style={{color:'gray'}} className='text-center py-5'><i>No hay programas mensuales activos</i></h4>}

          <div className='d-flex flex-row'>
              <div className='col-8 d-flex flex-row alig-items-center justify-content-start'>
                  <CameraVideoFill size={'2em'} className='mr-2 mt-1' color="#2C8BFF" />
                  <h3>Próximas Clases por Zoom</h3>
                </div>
                <div className='col-4 d-flex flex-row alig-items-center justify-content-end'>
                <i onClick={handleVerClasesZoom} style={{cursor:'pointer',fontSize:'large'}}>Ver todas las clases</i>
              </div>
          </div>
            {zoomMeetings.length>0?
            <DisplayCarousel allClases={allClases} zoomMeetings={zoomMeetings} market={true} home={true}/>:
            <h4 style={{color:'gray'}} className='text-center py-5'><i>No se ha agendado ninguna clase por Zoom</i></h4>}

            <div className='d-flex flex-row'>
                <div className='col-8 d-flex flex-row alig-items-center justify-content-start'>
                    <h3>Clases en Video</h3>
                  </div>
                  <div className='col-4 d-flex flex-row alig-items-center justify-content-end'>
                  <i onClick={handleVerClasesVideo} style={{cursor:'pointer',fontSize:'large'}}>Ver todas las clases</i>
                </div>
            </div>
            {videoClases.length>0?
            <DisplayCarousel allClases={allClases} array={videoClases} market={true} home={true}/>:
            <h4 style={{color:'gray'}} className='text-center py-5'><i>No hay clases con video</i></h4>}

        </div>
      </div>
    )

}

export default withRouter(MarketPlace)
