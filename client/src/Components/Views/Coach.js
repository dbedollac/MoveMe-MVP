import React, { useState, useContext, useEffect } from "react";
import Header from '../Molecules/Header'
import { Auth } from "../../Config/AuthContext";
import {db, auth} from '../../Config/firestore'
import { withRouter } from "react-router";
import { CameraVideoFill } from 'react-bootstrap-icons';
import DisplayCarousel from '../Molecules/DisplayCarousel'
import MonthlyProgram from './MonthlyProgram'
import MyClasses from './MyClasses'
import './InstructorProfile.css'


function Coach(props) {
  const uid = props.match.params.uid
  const { usuario } = useContext(Auth);
  const [profileName, setprofileName] = useState(null)
  const [profilePicture, setprofilePicture] = useState(null)
  const [selfDescription, setselfDescription] = useState(null)
  const [monthlyProgramPrice, setmonthlyProgramPrice] = useState(null)
  const [instructor, setInstructor] = useState(null)
  const [allClases, setallClases] = useState([])
  const [zoomMeetings,setZoomMeetings] = useState([])
  const [zoomMeetingsProgram,setZoomMeetingsProgram] = useState(0)
  const [videoClases, setvideoClases] = useState([])
  const [user, setUser] = useState(false);
  const [monthlyProgram,setMonthlyProgram] = useState(false)
  const [myClasses,setmyClasses] = useState(false)

  const handleVerMonthlyProgram = () =>{
    setMonthlyProgram(!monthlyProgram)
  }

  const handleVerClases = () =>{
    setmyClasses(!myClasses)
  }

  useEffect( ()=>{

    if (usuario) {
      var docRef = db.collection("Users").doc(usuario.uid);
       docRef.get().then((doc)=>{
      if (doc.exists) {
          setUser(true)
      } else {
          // doc.data() will be undefined in this case
          console.log("No es usuario");
      }
      }).catch(function(error) {
          console.log("Error getting document:", error);
      });
    }

      var docRef = db.collection("Instructors").doc(uid);
       docRef.get().then((doc) =>{
        setprofileName(doc.data().profileName)
        setprofilePicture(doc.data().imgURL)
        setselfDescription(doc.data().selfDescription)
        setmonthlyProgramPrice(doc.data().monthlyProgram.Price)
        setInstructor(doc.data())
      })

      if (allClases.length===0) {
       docRef.collection('Classes')
                      .get()
                      .then((querySnapshot) => {
                          setvideoClases(allClases.filter(item => item.data.videoURL!==undefined))
                          querySnapshot.forEach((doc) => {
                               allClases.push({id:doc.id, data: doc.data()});
                          });
                      })
                      .catch(function(error) {
                          console.log("Error getting documents: ", error);
                      })}

      if (zoomMeetings.length===0) {
       docRef.collection('ZoomMeetingsID').get()
                  .then(function(querySnapshot) {
                    setZoomMeetingsProgram(zoomMeetings.filter(item => item.monthlyProgram===true))
                    var now = new Date(Date.now()-3600000).toISOString()
                      querySnapshot.forEach(function(doc) {
                        if(doc.data().startTime>now){
                        zoomMeetings.push({startTime:doc.data().startTime,meetingID:doc.data().meetingID,claseID:doc.data().claseID, monthlyProgram:doc.data().monthlyProgram})}
                      }

                    )
                  })
                  .catch(function(error) {
                      console.log("Error getting documents: ", error);
                  });
                }

       },[profileName])

  if (monthlyProgram) {
    return <MonthlyProgram market={props.match.params.uid?true:false} instructor={{data:instructor,id:uid}}/>
  }else {
    if (myClasses) {
      return <MyClasses market={props.match.params.uid?true:false} instructor={{data:instructor,id:uid}}/>
    }
  }

  return(
    <>
      <Header instructor={usuario?user?false:true:null} user={usuario?user?true:false:null}/>
          <div className='InstructorProfile-container'>
              <div className='text-center InstructorProfile-container-header d-flex flex-row'>
                  <div className='col-6 profilePicture' style={{
                    backgroundImage: `url(${profilePicture})`,
                    backgroundPosition: 'center',
                    backgroundSize: 'cover'}}>
                    {profilePicture?null:<img src='/logo.jpg' className='card-img-top p-2' style={{height: '30vw'}}/>}
                  </div>
                  <div className='col-6 d-flex flex-column'>
                    <h1>{profileName}</h1>
                    <p className='text-left'>{selfDescription}</p>
                    <div className='InstructorProfile-container-programa p-2'>
                      <div className='d-flex flex-row align-items-center justify-content-around'>
                        <h2>Programa Mensual</h2>
                        <div className='rounded col-4' style={{backgroundColor: 'lightgray', fontSize: '20px'}}> {monthlyProgramPrice?'$ '+monthlyProgramPrice:null} </div>
                      </div>
                      <div className='d-flex flex-row'>
                        <div className='col-6 monthlyProgram-clasesZoom d-flex flex-column'>
                          <p style={{ fontSize: '40px'}}>{zoomMeetingsProgram.length}</p>
                          <p>Clases por Zoom</p>
                        </div>
                        <div className='col-6 d-flex flex-column'>
                          <p style={{ fontSize: '40px'}}>{videoClases.length}</p>
                          <p>Clases en Video</p>
                        </div>
                      </div>
                      <button className='btn-light m-3 rounded btn-lg' onClick={handleVerMonthlyProgram}>Ver</button>
                    </div>
                  </div>
              </div>
              <div>
                <div className='d-flex flex-row'>
                  <div className='col-8 d-flex flex-row alig-items-center justify-content-start'>
                    <CameraVideoFill size={'2em'} className='mr-2 mt-1' color="#2C8BFF" />
                    <h3>Próximas Clases por Zoom</h3>
                  </div>
                  <div className='col-4 d-flex flex-row alig-items-center justify-content-end'>
                  <i onClick={handleVerClases} style={{cursor:'pointer',fontSize:'large'}}>Ver todas las clases</i>
                  </div>
                </div>
                {zoomMeetings.length>0?
                <DisplayCarousel allClases={allClases} zoomMeetings={zoomMeetings} market={true} instructor={{data:instructor,id:uid}}/>:
                <h4 style={{color:'gray'}} className='text-center py-5'><i>No se ha agendado ninguna clase por Zoom</i></h4>}
                <div className='d-flex flex-row'>
                    <div className='col-8 d-flex flex-row alig-items-center justify-content-start'>
                        <h3>Clases en Video</h3>
                      </div>
                      <div className='col-4 d-flex flex-row alig-items-center justify-content-end'>
                      <i onClick={handleVerClases} style={{cursor:'pointer',fontSize:'large'}}>Ver todas las clases</i>
                    </div>
                </div>
                {videoClases.length>0?
                <DisplayCarousel allClases={allClases} array={videoClases} market={true}  instructor={{data:instructor,id:uid}}/>:
                <h4 style={{color:'gray'}} className='text-center py-5'><i>No hay clases con video</i></h4>}
            </div>
      </div>
    </>
  )
}

export default Coach
