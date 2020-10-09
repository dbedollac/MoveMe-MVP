import React, { useState, useContext, useEffect } from "react";
import MonthlyProgramDay from '../Molecules/MonthlyProgramDay'
import { useTranslation } from 'react-i18next';

function MonthlyProgramWeek(props) {
  const[week,setweek]=useState(null)
  const[active,setActive]=useState(false)
  const { t } = useTranslation();

    useEffect(()=>{
      getWeekDates()
    },[])

    const getDayDate = (date) =>{
      var days = date.getDate().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})
      var month = (date.getMonth()+1).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})
      var year = date.getFullYear()

      return(days+'/'+month+'/'+year)
    }

    const getWeekDates = () =>{
      var month = props.thisSunday.getMonth()
      var year = props.thisSunday.getFullYear()

      var thisSunday = props.thisSunday.getDate() // First day is the day of the month - the day of the week

      if (props.week===0) {
        setActive(true)
      }

        var sunday=new Date(year,month,thisSunday+7*(props.week))
          setweek({
            sunday: sunday,
            monday: new Date(sunday.getTime()+(27*1 * 60 * 60 * 1000)),
            tuesday: new Date(sunday.getTime()+(27*2 * 60 * 60 * 1000)),
            wednesday: new Date(sunday.getTime()+(27*3 * 60 * 60 * 1000)),
            thursday: new Date(sunday.getTime()+(27*4 * 60 * 60 * 1000)),
            friday:new Date(sunday.getTime()+(27*5 * 60 * 60 * 1000)),
            saturday: new Date(sunday.getTime()+(27*6 * 60 * 60 * 1000)),
          })
    }

  return(
    <div className='card'>
      <div className='card-header d-flex flex-column' style={{backgroundColor:'white'}}>
        <h5 className='text-center' style={{color:active?'#F39119':'black'}}>{week?getDayDate(week.sunday)+' - '+getDayDate(week.saturday):null}</h5>
      </div>
      <div className='list-group'>
        <MonthlyProgramDay trialClass={props.trialClass} dayDate={week?week.sunday:null} dayName={t('mProgram.5','Domingo')} className='list-group-item' instructor={props.instructor} zoomMeetings={props.zoomMeetings?props.zoomMeetings:false}/>
      </div>
      <div className='list-group'>
        <MonthlyProgramDay trialClass={props.trialClass} dayDate={week?week.monday:null} dayName={t('mProgram.6','Lunes')} className='list-group-item' instructor={props.instructor} zoomMeetings={props.zoomMeetings?props.zoomMeetings:false}/>
      </div>
      <div className='list-group'>
        <MonthlyProgramDay trialClass={props.trialClass} dayDate={week?week.tuesday:null} dayName={t('mProgram.7','Martes')} className='list-group-item' instructor={props.instructor} zoomMeetings={props.zoomMeetings?props.zoomMeetings:false}/>
      </div>
      <div className='list-group'>
        <MonthlyProgramDay trialClass={props.trialClass} dayDate={week?week.wednesday:null} dayName={t('mProgram.8','Miércoles')} className='list-group-item' instructor={props.instructor} zoomMeetings={props.zoomMeetings?props.zoomMeetings:false}/>
      </div>
      <div className='list-group'>
        <MonthlyProgramDay trialClass={props.trialClass} dayDate={week?week.thursday:null} dayName={t('mProgram.9','Jueves')} className='list-group-item' instructor={props.instructor} zoomMeetings={props.zoomMeetings?props.zoomMeetings:false}/>
      </div>
      <div className='list-group'>
        <MonthlyProgramDay trialClass={props.trialClass} dayDate={week?week.friday:null} dayName={t('mProgram.10','Viernes')} className='list-group-item' instructor={props.instructor} zoomMeetings={props.zoomMeetings?props.zoomMeetings:false}/>
      </div>
      <div className='list-group'>
        <MonthlyProgramDay trialClass={props.trialClass} dayDate={week?week.saturday:null} dayName={t('mProgram.11','Sábado')} className='list-group-item' instructor={props.instructor} zoomMeetings={props.zoomMeetings?props.zoomMeetings:false}/>
      </div>
    </div>
  )
}

export default MonthlyProgramWeek
