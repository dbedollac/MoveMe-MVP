import React, { useState, useContext, useEffect } from "react";
import Header from '../Molecules/Header'
import MonthlyProgramWeek from '../Cards/MonthlyProgramWeek'
import RefreshToken from '../Atoms/RefreshToken'
import {db} from '../../Config/firestore'
import { Auth } from "../../Config/AuthContext";
import './MonthlyProgram.css'

function MonthlyProgram() {
  const { usuario } = useContext(Auth);

  useEffect(()=>{
    if (usuario) {
      var docRef = db.collection("Instructors").doc(usuario.email);
      docRef.get().then(async (doc)=>{
      if (doc.exists) {
            RefreshToken(usuario.email, doc.data().zoomRefreshToken)
        } else {
            console.log("No such document!");
        }
        }).catch(function(error) {
            console.log("Error getting document:", error);
        });
    }
  })

  return (
    <div>
      <Header type={1}/>
        <div className='MonthlyProgram-container d-flex flex-row flex-wrap justify-content-start'>
          <div className='col-5 mt-2'>
            <MonthlyProgramWeek number={1}/>
          </div>
        </div>
    </div>
  )
}

export default MonthlyProgram
