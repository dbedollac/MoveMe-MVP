import React, { useState, useContext, useEffect } from "react";
import MonthlyProgramDay from '../Atoms/MonthlyProgramDay'

function MonthlyProgramWeek(props) {
  return(
    <div className='card'>
      <div className='card-header'>
        <h3 className='text-center'>Semana {props.number}</h3>
      </div>
      <MonthlyProgramDay day='Lunes' week={1}/>
    </div>
  )
}

export default MonthlyProgramWeek
