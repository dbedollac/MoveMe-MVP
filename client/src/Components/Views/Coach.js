import React, { useState, useContext, useEffect } from "react";
import Header from '../Molecules/Header'
import { Auth } from "../../Config/AuthContext";
import {db, auth} from '../../Config/firestore'
import { withRouter } from "react-router";
import { CameraVideoFill } from 'react-bootstrap-icons';
import DisplayCarousel from '../Molecules/DisplayCarousel'
import './InstructorProfile.css'


function Coach(props) {
  const uid = props.match.params.uid
  const { usuario } = useContext(Auth);
  const [profileName, setprofileName] = useState(null)
  const [profilePicture, setprofilePicture] = useState(null)
  const [selfDescription, setselfDescription] = useState(null)
  const [monthlyProgramPrice, setmonthlyProgramPrice] = useState(null)
  const [allClases, setallClases] = useState([])
  const [zoomMeetings,setZoomMeetings] = useState([])
  const [user, setUser] = useState(false);

  useEffect(()=>{
    console.log(usuario)

    if (usuario) {
      var docRef = db.collection("Users").doc(usuario.uid);
      docRef.get().then((doc)=>{
      if (doc.exists) {
          setUser(true)
      } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
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
                      querySnapshot.forEach(function(doc) {
                        zoomMeetings.push({startTime:doc.data().startTime,meetingID:doc.data().meetingID,claseID:doc.data().claseID})
                      }

                    )
                      setZoomMeetings(zoomMeetings)
                  })
                  .catch(function(error) {
                      console.log("Error getting documents: ", error);
                  });

       },[usuario])

  return(
    <>
      <Header instructor={usuario?user?false:true:null} user={usuario?user?true:false:null}/>
      {console.log(zoomMeetings)}
      {console.log(allClases)}
      {console.log(props.location.pathname)}
    </>
  )
}

export default Coach
