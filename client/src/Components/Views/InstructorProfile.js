import React, { useState, useContext, useEffect } from "react";
import Header from '../Molecules/Header'
import { Auth } from "../../Config/AuthContext";
import {db, auth} from '../../Config/firestore'
import { withRouter } from "react-router";
import { CameraVideoFill, CollectionPlayFill, Plus } from 'react-bootstrap-icons';
import DisplayCarousel from '../Molecules/DisplayCarousel'
import {proxyurl} from '../../Config/proxyURL'
import { useTranslation } from 'react-i18next';
import {iva} from '../../Config/Fees'
import StripeFee from '../Atoms/StripeFee'
import facebookLogo from '../Views/Images/Facebook.png'
import instagramLogo from '../Views/Images/Instagram.png'
import './InstructorProfile.css'

function InstructorProfile(props) {
const { usuario } = useContext(Auth);
const [profileName, setprofileName] = useState(null)
const [profilePicture, setprofilePicture] = useState(null)
const [selfDescription, setselfDescription] = useState(null)
const [facebookLink, setFacebook] = useState(null)
const [instagramLink, setInstagram] = useState(null)
const [monthlyProgramPrice, setmonthlyProgramPrice] = useState(null)
const [instructor, setInstructor] = useState(null)
const [allClases, setallClases] = useState([])
const [zoomMeetings,setZoomMeetings] = useState([])
const [videoClases, setvideoClases] = useState([])
const [aux,setAux] = useState([])
const { t } = useTranslation();

const today = new Date()
const firstMonthDay = new Date(today.getFullYear(),today.getMonth(),1)
const firstMonthSunday = firstMonthDay.getDay()===0?0:7-firstMonthDay.getDay()+1
const fiveWeeks = (new Date(today.getFullYear(),today.getMonth(),firstMonthSunday+28).getMonth() === today.getMonth())
const fiveWeeks0= fiveWeeks?-2:0

  useEffect(()=>{
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
        setFacebook(doc.data().linkFB)
        setInstagram(doc.data().linkIG)
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
                  .then(async function(querySnapshot) {
                    var now = new Date(Date.now()-3600000).toISOString()
                      querySnapshot.forEach(function(doc) {

                        if(doc.data().startTime>now){
                          if (!aux.includes(doc.id)) {
                            aux.push(doc.id)
                            zoomMeetings.push({startTime:doc.data().startTime,meetingID:doc.data().meetingID,claseID:doc.data().claseID, monthlyProgram:doc.data().monthlyProgram})
                          }
                      }
                    }

                    )
                  })
                  .catch(function(error) {
                      console.log("Error getting documents: ", error);
                  });
                }

         }
       },[profileName,usuario,videoClases])


    return (
      <div>
      <Header instructor={true} />
          <div className='InstructorProfile-container'>
              <div className='text-center InstructorProfile-container-header d-flex flex-column flex-md-row'>
                  <div className='col-12 col-md-6 profilePicture' style={{
                    backgroundImage: `url(${profilePicture})`,
                    backgroundPosition: 'center',
                    backgroundSize: 'cover'}}>
                    {profilePicture?null:<img src='/logo.jpg' className='p-2'/>}
                    <div className='fixed-bottom InstructorProfile-logos'>
                      {facebookLink?
                      <a href={facebookLink} target="_blank"> <img className='float-right ' src={facebookLogo} alt='Facebook' style={{width:'3em'}}/> </a>
                      :null
                      }
                      {instagramLink?
                      <a href={instagramLink} target="_blank"> <img className='float-right mr-2' src={instagramLogo} alt='Instagram' style={{width:'3em'}}/> </a>
                      :null
                      }
                    </div>
                  </div>
                  <div className='col-12 col-md-6 d-flex flex-column'>
                  <div className='InstructorProfile-container-nameDescription'>
                    <h2>{profileName}</h2>
                    <p className='text-left'>{selfDescription}</p>
                  </div>
                    <div className='InstructorProfile-container-programa p-2'>
                      <div className='d-flex flex-row align-items-center justify-content-around' onClick={()=>{props.history.push('/monthly-program')}} style={{cursor:'pointer'}}>
                        <h3>{t('iProfile.1','Reto Mensual')}</h3>
                        {monthlyProgramPrice?'$ '+Math.ceil(monthlyProgramPrice*(1+iva)+StripeFee(monthlyProgramPrice*(1+iva))):null}
                      </div>
                      <div className='d-flex flex-row justify-content-around align-items-center'>
                        <div className='monthlyProgram-clasesZoom d-flex flex-column'>
                          <p style={{ fontSize: '40px'}}>{zoomMeetings.length}</p>
                          <p>{t('iProfile.2','Clases por Zoom')}</p>
                        </div>
                        <Plus size={'2em'}/>
                        <div className='d-flex flex-column'>
                          <p style={{ fontSize: '40px'}}>{videoClases.length}</p>
                          <p>{t('iProfile.3','Clases en Video')}</p>
                        </div>
                      </div>
                    </div>
                  </div>
              </div>
              <div>

                <div className='d-flex flex-row p-2'>
                  <div className='d-flex flex-row alig-items-center justify-content-start'>
                    <CameraVideoFill size={'2em'} className='mr-2' color="#2C8BFF" />
                    <h4>{t('iProfile.5','Próximas Clases por Zoom')}</h4>
                  </div>
                </div>

                {zoomMeetings.length>0?
                <DisplayCarousel allClases={allClases} zoomMeetings={zoomMeetings} instructor={usuario?{data:instructor,id:usuario.uid}:null}/>:
                <h5 style={{color:'gray'}} className='text-center py-5'><i>{t('iProfile.7','No se ha agendado ninguna clase por Zoom')}</i></h5>}

                <div className='d-flex flex-row p-2'>
                  <div className='d-flex flex-row alig-items-center justify-content-start'>
                    <CollectionPlayFill size={'2em'} className='mr-2' color='darkcyan'/>
                    <h4>{t('iProfile.3','Clases en Video')}</h4>
                  </div>
                </div>

                {videoClases.length>0?
                <DisplayCarousel allClases={allClases} array={videoClases} instructor={usuario?{data:instructor,id:usuario.uid}:null}/>:
                <h5 style={{color:'gray'}} className='text-center py-5'><i>{t('iProfile.8','No hay clases con video')}</i></h5>}
            </div>
      </div>
  </div>
    )
}

export default withRouter(InstructorProfile)
