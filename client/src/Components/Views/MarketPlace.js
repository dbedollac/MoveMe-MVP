import React, {useState,useEffect,useContext} from 'react';
import Header from '../Molecules/Header'
import { Auth } from "../../Config/AuthContext";
import {db, auth} from '../../Config/firestore'
import { withRouter } from "react-router";
import DisplayCarousel from '../Molecules/DisplayCarousel'
import MarketAllClasses from './MarketAllClasses'
import { ArrowLeft, CameraVideoFill, CollectionPlayFill, Calendar3Fill } from 'react-bootstrap-icons';
import { useTranslation } from 'react-i18next';
import './MarketPlace.css'

function MarketPlace(props) {
  const { usuario } = useContext(Auth);
  const [allClases, setallClases] = useState([])
  const [videoClases, setvideoClases] = useState([])
  const [zoomMeetings,setZoomMeetings] = useState([])
  const [allInstructors, setallInstructors] = useState([])
  const [verClasesZoom, setverClasesZoom] = useState(false)
  const [verClasesVideo, setverClasesVideo] = useState(false)
  const [verProgramas, setverProgramas] = useState(false)
  const { t } = useTranslation();

  const handleBack = () =>{
    setverClasesZoom(false)
    setverClasesVideo(false)
    setverProgramas(false)
  }

  const handleVerClasesZoom = () =>{
    setverClasesZoom(!verClasesZoom)
  }

  const handleVerClasesVideo = () =>{
    setverClasesVideo(!verClasesVideo)
  }

  const handleVerProgramas = () =>{
    setverProgramas(!verProgramas)
  }

  useEffect(()=>{
    if (props.return) {
      if (props.return.includes('coach')) {
        props.history.push(props.return)
      }
    }

    if (props.location.state) {
      if (props.location.state[0]){
      if (props.location.state[0].includes('coach')) {
            props.history.push(props.location.state[0])
          }
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
    if (verProgramas) {
      return (
        <>
          <Header  user={usuario?true:false}/>
          <div className='MarketPlace-container d-flex flex-column'>
            <div className='d-flex flex-row-reverse'>
              <button className='btn-light rounded m-2' onClick={handleBack}><ArrowLeft />{t('mPlace.1',' Regresar')}</button>
            </div>
            <MarketAllClasses allInstructors={allInstructors}/>
          </div>
        </>
      )
    }

    if (verClasesZoom) {
      return (
        <>
          <Header  user={usuario?true:false}/>
          <div className='MarketPlace-container d-flex flex-column'>
            <div className='d-flex flex-row-reverse'>
              <button className='btn-light rounded m-2' onClick={handleBack}><ArrowLeft />{t('mPlace.1',' Regresar')}</button>
            </div>
            <MarketAllClasses allClases={allClases} zoomMeetings={zoomMeetings}/>
          </div>
        </>
      )
    }

    if (verClasesVideo) {
      return (
        <>
          <Header  user={usuario?true:false}/>
          <div className='MarketPlace-container d-flex flex-column'>
            <div className='d-flex flex-row-reverse'>
              <button className='btn-light rounded m-2' onClick={handleBack}><ArrowLeft />{t('mPlace.1',' Regresar')}</button>
            </div>
            <MarketAllClasses allClases={allClases} array={videoClases}/>
          </div>
        </>
      )
    }

    return (
      <div>
        <Header  user={usuario?true:false}/>
        <div className='MarketPlace-container'>
          <div className='d-flex flex-column flex-md-row pt-2'>
              <div className='col-md-8 d-flex flex-row alig-items-center justify-content-start'>
                  <Calendar3Fill size={'2em'} className='mr-2' color='coral'/>
                  <h4>{t('mPlace.2','Retos Mensuales')}</h4>
                </div>
                <div className='col-md-4 d-flex flex-row alig-items-center justify-content-md-end'>
                <i onClick={handleVerProgramas} style={{cursor:'pointer',fontSize:'large'}}>{t('mPlace.3','Ver todos los retos')}</i>
              </div>
          </div>
            {allInstructors.length>0?
            <DisplayCarousel allInstructors={allInstructors} market={true} home={true}/>:
            <h5 style={{color:'gray'}} className='text-center py-5'><i>{t('mPlace.4','Buscando retos mensuales activos...')}</i></h5>}

          <div className='d-flex flex-column flex-md-row my-2'>
              <div className='col-md-8 d-flex flex-row alig-items-center justify-content-start'>
                  <CameraVideoFill size={'2em'} className='mr-2' color="#2C8BFF" />
                  <h4>{t('mPlace.5','Próximas Clases por Zoom')}</h4>
                </div>
                <div className='col-md-4 d-flex flex-row alig-items-center justify-content-md-end'>
                <i onClick={handleVerClasesZoom} style={{cursor:'pointer',fontSize:'large'}}>{t('mPlace.6','Ver todas las clases por Zoom')}</i>
              </div>
          </div>
            {zoomMeetings.length>0?
            <DisplayCarousel allClases={allClases} zoomMeetings={zoomMeetings} market={true} home={true}/>:
            <h5 style={{color:'gray'}} className='text-center py-5'><i>{t('mPlace.7','Buscando clases por Zoom...')}</i></h5>}

            <div className='d-flex flex-column flex-md-row my-2'>
                <div className='col-md-8 d-flex flex-row alig-items-center justify-content-start'>
                    <CollectionPlayFill size={'2em'} className='mr-2' color='darkcyan'/>
                    <h4>{t('mPlace.8','Clases en Video')}</h4>
                  </div>
                  <div className='col-md-4 d-flex flex-row alig-items-center justify-content-md-end'>
                  <i onClick={handleVerClasesVideo} style={{cursor:'pointer',fontSize:'large'}}>{t('mPlace.9','Ver todas las clases en video')}</i>
                </div>
            </div>
            {videoClases.length>0?
            <DisplayCarousel allClases={allClases} array={videoClases} market={true} home={true}/>:
            <h5 style={{color:'gray'}} className='text-center py-5'><i>{t('mPlace.10','Buscando clases en video...')}</i></h5>}

        </div>
      </div>
    )

}

export default withRouter(MarketPlace)
