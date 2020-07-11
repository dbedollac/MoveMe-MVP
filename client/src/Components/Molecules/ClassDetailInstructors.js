import React from 'react'
import './ClassDetailInstructors.css'
import InstructorsDetailCard from '../Cards/InstructorsDetailCard'

function ClassDetailInstructors(props) {
  return(
    <div className='ClassDetailInstructors-container d-flex flex-row'>
      <div className='col-3 MyClasses-summary d-flex flex-column justify-content-start'>
      </div>
      <div className='col-9 pt-2' >
        {props.clase? <InstructorsDetailCard data={props.clase.data}/> :
          null}
      </div>
    </div>
  )
}

export default ClassDetailInstructors
