import React, { useState, useContext, useEffect } from "react";
import Header from '../Molecules/Header'
import MonthlyProgramWeek from '../Cards/MonthlyProgramWeek'
import './MonthlyProgram.css'

function MonthlyProgram() {

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
