import React, { useState, useContext, useEffect } from "react";
import Header from '../Molecules/Header'
import { Auth } from "../../Config/AuthContext";
import {db, auth} from '../../Config/firestore'
import { withRouter } from "react-router";
import { Link } from "react-router-dom";
import { CameraVideoFill } from 'react-bootstrap-icons';
import DisplayCarousel from '../Molecules/DisplayCarousel'
import {proxyurl} from '../../Config/proxyURL'
import './InstructorProfile.css'

function InstructorProfile(props) {
const { usuario } = useContext(Auth);
const [profileName, setprofileName] = useState(null)
const [profilePicture, setprofilePicture] = useState(null)
const [selfDescription, setselfDescription] = useState(null)
const [monthlyProgramPrice, setmonthlyProgramPrice] = useState(null)
const [clasesNumber, setclasesNumber] = useState(0)
const [videosNumber, setvideosNumber] = useState(0)
const [videoClases, setvideoClases] = useState([])
const [allClases, setallClases] = useState([])
const [zoomMeetings,setZoomMeetings] = useState([])
const [zoomMeetingsNumber,setZoomMeetingsNumber] = useState(0)


const deleteMeeting = (meetingID) =>{
  var docRef = db.collection("Instructors").doc(usuario.uid);
  docRef.get().then((doc)=>{

  if (doc.exists) {
        let url=proxyurl+"zoomAPI/delete"

        let init = {
          method: 'POST',
          body: JSON.stringify({
               token: doc.data().zoomToken,
               meetingID:meetingID
           }),
           headers: {
             "content-type": "application/json"
           }
        }

        fetch(url,init).then((response)=>{

              var docRef = db.collection("Instructors").doc(usuario.uid);
              docRef.collection('ZoomMeetingsID').where("meetingID", "==", meetingID).get()
                  .then(function(querySnapshot) {
                    querySnapshot.forEach(function(doc) {
                      console.log(doc)
                      doc.ref.delete()
                      .catch(function(error) {
                          console.log("Error getting documents: ", error)
                        })
                    })
                  })
                  .catch(function(error) {
                      console.log("Error getting documents: ", error);
                  });

        }, function(error) {
            console.log(error.message)
            window.location.reload(false)
        })

      } else {
       console.log("No such document!");
   }
   }).catch(function(error) {
       console.log("Error getting document:", error);
   });
   }


const updateMeeting = (meetingID) =>{
     var docRef = db.collection("Instructors").doc(usuario.uid);
     docRef.get().then((doc)=>{

     if (doc.exists) {
           let url=proxyurl+"zoomAPI/getdata"

           let init = {
             method: 'POST',
             body: JSON.stringify({
                  token: doc.data().zoomToken,
                  meetingID:meetingID,
              }),
              headers: {
                "content-type": "application/json"
              }
           }

           fetch(url,init).then((response)=>{
               Promise.resolve(response.json()).then((resp) =>{
                if(resp.occurrences.length > 0){
                docRef.collection('ZoomMeetingsID').doc(meetingID.toString()).set({
                  startTime: resp.occurrences[0].start_time
                },{ merge: true })}else {
                  deleteMeeting(meetingID)
                }
               }
               )
           }, function(error) {
               console.log(error.message)
               window.location.reload(false)
           })

         } else {
          console.log("No such document!");
      }
      }).catch(function(error) {
          console.log("Error getting document:", error);
      });
   }

  useEffect(()=>{
    console.log(usuario)
    auth.onAuthStateChanged((usuario) => {
      if (usuario===null) {
          props.history.push("/market");
      }
    })


    if (usuario) {
      var docRef = db.collection("Instructors").doc(usuario.uid);
      docRef.get().then((doc) =>{
        setprofileName(doc.data().profileName)
        setprofilePicture(doc.data().imgURL)
        setselfDescription(doc.data().selfDescription)
        setmonthlyProgramPrice(doc.data().monthlyProgram.Price)
      })

      docRef.collection('ZoomMeetingsID').where("monthlyProgram", "==", true)
          .get()
          .then(snap => setclasesNumber(snap.size))
          .catch(function(error) {
              console.log("Error getting documents: ", error);
          })

      docRef.collection('Classes').where("videoURL", ">=", "")
              .get()
              .then((querySnapshot) => {
                  querySnapshot.forEach((doc) => {
                       videoClases.push({id:doc.id, data: doc.data()});
                  });
                  setvideosNumber(videoClases.length)
              })
              .catch(function(error) {
                  console.log("Error getting documents: ", error);
              })

      docRef.collection('Classes')
                      .get()
                      .then((querySnapshot) => {
                          querySnapshot.forEach((doc) => {
                               allClases.push({id:doc.id, data: doc.data()});
                          });
                      })
                      .catch(function(error) {
                          console.log("Error getting documents: ", error);
                      })

      docRef.collection('ZoomMeetingsID').get()
                  .then(function(querySnapshot) {
                    var now = new Date(Date.now()-3600000).toISOString()
                    setZoomMeetingsNumber(querySnapshot.size)
                      querySnapshot.forEach(function(doc) {
                        if(doc.data().startTime>now){
                        zoomMeetings.push({startTime:doc.data().startTime,meetingID:doc.data().meetingID,claseID:doc.data().claseID})}
                        else {
                        if(!doc.data().monthlyProgram){
                          deleteMeeting(doc.data().meetingID)
                        }else{
                          updateMeeting(doc.data().meetingID)
                          }
                        }
                      })
                      setZoomMeetings(zoomMeetings)
                  })
                  .catch(function(error) {
                      console.log("Error getting documents: ", error);
                  });
         }
       },[usuario])

    const handleVerMonthlyProgram = () =>{
      props.history.push("/monthly-program")
    }

    return (
      <div>
      {console.log(videoClases.length)}
      {console.log(zoomMeetings[0])}
      <Header instructor={true} />
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
                          <p style={{ fontSize: '40px'}}>{clasesNumber}</p>
                          <p>Clases por Zoom</p>
                        </div>
                        <div className='col-6 d-flex flex-column'>
                          <p style={{ fontSize: '40px'}}>{videosNumber}</p>
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
                    <Link to="/misclases"><i>Ver todas las clases</i></Link>
                  </div>
                </div>
                {zoomMeetingsNumber>0?
                <DisplayCarousel allClases={allClases} zoomMeetings={zoomMeetings}/>:
                <h4 style={{color:'gray'}} className='text-center py-5'><i>No se ha agendado ninguna clase por Zoom</i></h4>}
                <div className='d-flex flex-row'>
                    <h3>Clases en Video</h3>
                </div>
                {videoClases.length>0?
                <DisplayCarousel allClases={allClases} array={videoClases}/>:
                <h4 style={{color:'gray'}} className='text-center py-5'><i>No hay clases con video</i></h4>}
            </div>
      </div>
  </div>
    )
}

export default withRouter(InstructorProfile)
