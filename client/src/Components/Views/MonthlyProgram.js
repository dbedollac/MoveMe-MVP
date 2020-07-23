import React, { useState, useContext, useEffect } from "react";
import Header from '../Molecules/Header'
import MonthlyProgramWeek from '../Cards/MonthlyProgramWeek'
import RefreshToken from '../Atoms/RefreshToken'
import SetMonthlyProgramPrice from '../Atoms/SetMonthlyProgramPrice'
import {db,auth} from '../../Config/firestore'
import { Auth } from "../../Config/AuthContext";
import { withRouter } from "react-router";
import './MonthlyProgram.css'

function MonthlyProgram(props) {
  const { usuario } = useContext(Auth);

  useEffect(()=>{

    auth.onAuthStateChanged((usuario) => {
      if (usuario===null) {
          props.history.push("/market");
      }
    })

    if (usuario) {
      var docRef = db.collection("Instructors").doc(usuario.uid);
      docRef.get().then( (doc)=>{
      if (doc.exists) {
            RefreshToken(usuario.uid, doc.data().zoomRefreshToken)
        } else {
            console.log("No such document!");
        }
        }).catch(function(error) {
            console.log("Error getting document:", error);
        });
    }
  },[usuario])

  return (
    <div>
    <Header instructor={true} />
        <div className='MonthlyProgram-container'>
          <SetMonthlyProgramPrice />
          <div className='d-flex flex-row flex-wrap justify-content-center'>
            <div className='col-5 mt-2'>
              <MonthlyProgramWeek week={1}/>
            </div>
            <div className='col-5 mt-2'>
              <MonthlyProgramWeek week={2}/>
            </div>
            <div className='col-5 mt-2'>
              <MonthlyProgramWeek week={3}/>
            </div>
            <div className='col-5 mt-2'>
              <MonthlyProgramWeek week={4}/>
            </div>
            <div className='col-5 mt-2'>
              <MonthlyProgramWeek week={5}/>
            </div>
          </div>
        </div>
    </div>
  )
}

export default withRouter(MonthlyProgram)
