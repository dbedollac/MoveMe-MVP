import React,{useContext,useState,useEffect} from 'react'
import Header from '../Molecules/Header'
import DisplayCarousel from '../Molecules/DisplayCarousel'
import { Auth } from "../../Config/AuthContext"
import {db, auth} from '../../Config/firestore'
import { withRouter } from "react-router";
import './ClasesZoom.css'

function ClasesZoom(props) {
  const { usuario } = useContext(Auth);
  const [retoClases,setretoClases] = useState([])
  const [retoMeetings,setretoMeetings] = useState([])
  const [zoomClases,setzoomClases] = useState([])
  const [zoomMeetings,setZoomMeetings] = useState([])
  const [allClases,setclasesAll] = useState([])
  const [allMeetings,setmeetingsAll] = useState([])

  const now=new Date(Date.now()-3600000).toISOString()

  const handlePurchases = async (purchase) =>{

    if (purchase.expire>new Date().toISOString()) {

      if (purchase.type.includes('Reto')) {

         await db.collection("Instructors").doc(purchase.instructor.uid)
                             .collection('Classes')
                                            .get()
                                            .then((querySnapshot) => {
                                                querySnapshot.forEach((doc) => {
                                                    retoClases.push({instructor:{id:purchase.instructor.uid,data:purchase.data.instructor},id:doc.id, data: doc.data(), expire:purchase.expire});
                                                })
                                            })
                                            .catch(function(error) {
                                                console.log("Error getting documents: ", error);
                                            })

        await db.collection("Instructors").doc(purchase.instructor.uid)
                                          .collection('ZoomMeetingsID').where('monthlyProgram','==',true)
                                            .get()
                                            .then((querySnapshot) => {
                                                querySnapshot.forEach((doc) => {
                                                    retoMeetings.push({
                                                    startTime:doc.data().startTime,
                                                    meetingID:doc.data().meetingID,
                                                    claseID:doc.data().claseID,
                                                    monthlyProgram:doc.data().monthlyProgram,
                                                    instructor:{id:purchase.instructor.uid,data:purchase.data.instructor},
                                                    joinURL:doc.data().joinURL
                                                    })
                                                })
                                            })
                                            .catch(function(error) {
                                                console.log("Error getting documents: ", error);
                                            })
      }
    }
    setclasesAll(retoClases.concat(zoomClases))
    setmeetingsAll(retoMeetings.concat(zoomMeetings))
  }

  useEffect(()=>{
    auth.onAuthStateChanged((usuario) => {
      if (usuario===null) {
          props.history.push("/market");
      }
    })

    if (usuario) {
      db.collection('Sales').where('user.uid','==',usuario.uid).get().then((querySnapshot)=>{
        var Zoom=[]
        var Meetings=[]
        querySnapshot.forEach((doc)=>{
          if (doc.data().type.includes('Zoom')) {
            if (doc.data().data.startTime.startTime>now) {
              Zoom.push({instructor:{id:doc.data().instructor.uid,data:doc.data().data.instructor},id:doc.data().data.claseID, data: doc.data().data.claseData, expire:doc.data().expire})
              Meetings.push({
              startTime:doc.data().data.startTime.startTime,
              meetingID:doc.data().data.meetingID,
              claseID:doc.data().data.claseID,
              monthlyProgram:doc.data().data.monthlyProgram,
              instructor:{id:doc.data().instructor.uid,data:doc.data().data.instructor},
              joinURL:doc.data().data.joinURL
              })
            }
        }
          handlePurchases(doc.data())
        })
        setzoomClases(Zoom)
        setZoomMeetings(Meetings)
      }).catch(error => console.log(error))
    }

  },[usuario])

  return(
    <div>
      <Header  user={usuario?true:false}/>
      <div className='ClasesZoom-container'>
        <div className='pt-2 pl-2'>
          <h3>Próximas Clases</h3>
          <DisplayCarousel allClases={retoClases.concat(zoomClases)} zoomMeetings={retoMeetings.concat(zoomMeetings)} ClasesZoom={true}/>
        </div>
      </div>
    </div>
    )
}

export default withRouter(ClasesZoom)
