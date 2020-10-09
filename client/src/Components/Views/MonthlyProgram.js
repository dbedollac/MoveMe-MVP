import React, { useState, useContext, useEffect } from "react";
import Header from '../Molecules/Header'
import MonthlyProgramWeek from '../Cards/MonthlyProgramWeek'
import RefreshToken from '../Atoms/RefreshToken'
import SetMonthlyProgramPrice from '../Molecules/SetMonthlyProgramPrice'
import DisplayCarousel from '../Molecules/DisplayCarousel'
import { CameraVideoFill, CollectionPlayFill, PlusCircleFill } from 'react-bootstrap-icons';
import {db,auth} from '../../Config/firestore'
import { Auth } from "../../Config/AuthContext";
import { withRouter } from "react-router";
import { useTranslation } from 'react-i18next';
import './MonthlyProgram.css'

function MonthlyProgram(props) {
  const { usuario } = useContext(Auth);
  const [user, setUser] = useState(false);
  const [trialClass,settrialClass] = useState(null)
  const [allClases, setallClases] = useState([])
  const [videoClases, setvideoClases] = useState([])
  const [refresh, setRefresh] = useState(true)
  const [instructor, setInstructor] = useState(null)
  const { t } = useTranslation();

  const today = new Date()
  var thisSunday = new Date(today.getFullYear(),today.getMonth(),today.getDate() - today.getDay())

  const weeks=[0,1,2,3,4]

  useEffect(()=>{

    if (!props.market) {
      auth.onAuthStateChanged((usuario) => {
        if (usuario===null) {
            props.history.push("/market");
        }
      })
    }

    if (usuario) {

      if (allClases.length===0) {
      var docRef = db.collection("Instructors").doc(usuario.uid);
       docRef.collection('Classes')
                      .get()
                      .then((querySnapshot) => {
                          querySnapshot.forEach((doc) => {
                               allClases.push({id:doc.id, data: doc.data()});
                          });
                          setvideoClases(allClases.filter(item => item.data.videoURL!==undefined))
                      })
                      .catch(function(error) {
                          console.log("Error getting documents: ", error);
                      })}

      if(!props.market&&!props.ClasesZoom&&refresh){
      var docRef = db.collection("Instructors").doc(usuario.uid);
      docRef.get().then( async (doc)=>{
      if (doc.exists) {
            await RefreshToken(usuario.uid, doc.data().zoomRefreshToken)
            setRefresh(false)
            setInstructor(doc.data())
        } else {
            console.log("No such document!");
        }
        }).catch(function(error) {
            console.log("Error getting document:", error);
        });}

        if(!props.ClasesZoom){var docRef2 = db.collection("Users").doc(usuario.uid);
        docRef2.get().then((doc)=>{
       if (doc.exists) {
           setUser(true)
           settrialClass(doc.data().trialClass)
       }
       }).catch(function(error) {
           console.log("Error getting document:", error);
       });
     }
   }else {
     settrialClass(0)
   }
 },[usuario,allClases])

  return (
    <div>
    {props.ClasesZoom?null:<Header instructor={usuario?user?!props.match.params.uid?true:false:true:null} user={usuario?user?true:false:null}/>}
        <div className='MonthlyProgram-container d-flex flex-column'>
          {props.market||props.ClasesZoom?null:
          <div className='col-12 d-flex flex-column'>
            <div className='MonthlyProgram-price col-12 col-lg-8 align-self-center mt-3'>
              {props.ClasesZoom?null:<SetMonthlyProgramPrice videoClasesLength={videoClases.length} market={props.match.params.uid?true:false} instructor={props.instructor}/>}
            </div>

            <div className='col-md-8 d-flex flex-row alig-items-center justify-content-start mt-2'>
              <CollectionPlayFill size={'2em'} className='mr-2' color='darkcyan'/>
              <h4>{t('iProfile.3','Clases en Video')}</h4>
              <PlusCircleFill color='gray' size='2em' className='ml-4'style={{cursor:'pointer'}} onClick={()=>{props.history.push("/myClasses")}}/>
            </div>
            {videoClases.length>0?
              <div>
              <DisplayCarousel fitnessKit={true} allClases={allClases} array={videoClases} market={false} instructor={usuario?{data:instructor,id:usuario.uid}:null}/>
              </div>:
            <h5 style={{color:'gray'}} className='text-center py-5'><i>{t('iProfile.8','No hay clases con video')}</i></h5>}

            <div className='col-md-8 d-flex flex-row alig-items-center justify-content-star mt-2'>
              <CameraVideoFill size={'2em'} className='mr-2' color="#2C8BFF" />
              <h4>{t('iProfile.2','Clases por Zoom')}</h4>
            </div>
          </div>
        }

          <div className='d-flex flex-row flex-wrap justify-content-center mb-4'>
            {weeks.map(week => (
              <div className='col-11 col-md-5 mt-2' key={week}>
                <MonthlyProgramWeek thisSunday={thisSunday} trialClass={trialClass} week={week} instructor={props.ClasesZoom?null:props.instructor} zoomMeetings={props.ClasesZoom?props.zoomMeetings:null}/>
              </div>
            ))}
          </div>
        </div>
    </div>
  )
}

export default withRouter(MonthlyProgram)
