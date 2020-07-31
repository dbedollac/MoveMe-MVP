import React, { useState, useContext, useEffect } from "react";
import ClassCard from '../Cards/ClassCard'
import InstructorsDetailCard from '../Cards/InstructorsDetailCard'
import { X, Search } from 'react-bootstrap-icons';

function MarketAllClasses(props) {
  const [clases, setclases] = useState([])
  const [clasesAll, setclasesAll] = useState([])
  const [pictures, setpictures] = useState([])
  const [filtersType, setfiltersType] = useState('')
  const [filtersLevel, setfiltersLevel] = useState('')
  const [filtersDuration, setfiltersDuration] = useState('')
  const [filterSearchClass,setfilterSearchClass] = useState('')
  const [filterSearchCoach,setfilterSearchCoach] = useState('')
  const [filterDateTime,setfilterDateTime] = useState('')
  const [detail, setdetail] = useState(false)
  const [claseDetail, setclaseDetail] = useState(null)
  const [aux, setaux] = useState(true)
  const [showMore, setshowMore] = useState(48)

  const handleVerMas = () =>{
    setshowMore(showMore + 24)
  }

  const sortMeetings = (a,b) => {
    const meetingA = a.startTime;
    const meetingB = b.startTime;

    let comparison = 0;
    if (meetingA > meetingB) {
      comparison = 1;
    } else if (meetingA < meetingB) {
      comparison = -1;
    }
    return comparison;
  }

  const resetFilters = () =>{
    setfiltersType('')
    setfiltersLevel('')
    setfiltersDuration('')
    setfilterSearchClass('')
    setfilterSearchCoach('')
    setfilterDateTime('')
    setclases(clasesAll)
  }

  const  handleDateTime = (event) =>{
    var clases00 = clasesAll.filter(item => item.instructor.data.profileName.toUpperCase().includes(filterSearchCoach.toUpperCase()))
    var clases01 = clases00.filter(item => item.data.title.toUpperCase().includes(filterSearchClass.toUpperCase()))
    var clases02 = clases01.filter(item => item.startTime>=event.target.value)

    var clases0 = clases02.filter(item => item.data.type.includes(filtersType));
    var clases1 = clases0.filter(item => item.data.level.includes(filtersLevel));
    switch (filtersDuration) {
      case '0': var clases2 = clases1.filter(item => (item.data.duration<=30));
        break;
      case '1': var clases2 = clases1.filter(item => (item.data.duration<=60&&item.data.duration>30));
        break;
      case '2': var clases2 = clases1.filter(item => (item.data.duration>60));
        break;
      default: var clases2 = clases1.filter(item => (item.data.duration<=1000));
    }

    setclases(clases2)
    setaux(false)
    setfilterDateTime(event.target.value)
  }

  const handleBuscador = (event) =>{
    var Busca = event.target.value
        var clases00 = clasesAll.filter(item => item.instructor.data.profileName.toUpperCase().includes(filterSearchCoach.toUpperCase()))
        var clases01 = clases00.filter(item => item.data.title.toUpperCase().includes(Busca.toUpperCase()))
        var clases02 = clases01.filter(item => item.startTime>=filterDateTime)

        var clases0 = clases02.filter(item => item.data.type.includes(filtersType));
        var clases1 = clases0.filter(item => item.data.level.includes(filtersLevel));
        switch (filtersDuration) {
          case '0': var clases2 = clases1.filter(item => (item.data.duration<=30));
            break;
          case '1': var clases2 = clases1.filter(item => (item.data.duration<=60&&item.data.duration>30));
            break;
          case '2': var clases2 = clases1.filter(item => (item.data.duration>60));
            break;
          default: var clases2 = clases1.filter(item => (item.data.duration<=1000));
        }

        setclases(clases2)
        setaux(false)
        setfilterSearchClass(Busca)
  }

  const handleBuscadorCoach = (event) =>{
    var Busca = event.target.value
        var clases00 = clasesAll.filter(item => item.instructor.data.profileName.toUpperCase().includes(Busca.toUpperCase()))
        var clases01 = clases00.filter(item => item.data.title.toUpperCase().includes(filterSearchClass.toUpperCase()))
        var clases02 = clases01.filter(item => item.startTime>=filterDateTime)

        var clases0 = clases02.filter(item => item.data.type.includes(filtersType));
        var clases1 = clases0.filter(item => item.data.level.includes(filtersLevel));
        switch (filtersDuration) {
          case '0': var clases2 = clases1.filter(item => (item.data.duration<=30));
            break;
          case '1': var clases2 = clases1.filter(item => (item.data.duration<=60&&item.data.duration>30));
            break;
          case '2': var clases2 = clases1.filter(item => (item.data.duration>60));
            break;
          default: var clases2 = clases1.filter(item => (item.data.duration<=1000));
        }

        setclases(clases2)
        setaux(false)
        setfilterSearchCoach(Busca)
  }

  const handleTypeChange =(event) => {
    var value =''
    if (event.target.value!=='todos') {
      value = event.target.value
    }
          var clases00 = clasesAll.filter(item => item.instructor.data.profileName.toUpperCase().includes(filterSearchCoach.toUpperCase()))
          var clases01 = clases00.filter(item => item.data.title.toUpperCase().includes(filterSearchClass.toUpperCase()))
          var clases02 = clases01.filter(item => item.startTime>=filterDateTime)

          var clases0 = clases02.filter(item => item.data.type.includes(value));
          var clases1 = clases0.filter(item => item.data.level.includes(filtersLevel));
          switch (filtersDuration) {
            case '0': var clases2 = clases1.filter(item => (item.data.duration<=30));
              break;
            case '1': var clases2 = clases1.filter(item => (item.data.duration<=60&&item.data.duration>30));
              break;
            case '2': var clases2 = clases1.filter(item => (item.data.duration>60));
              break;
            default: var clases2 = clases1.filter(item => (item.data.duration<=1000));
          }
          setclases(clases2)
          setaux(false)

      setfiltersType(value)
  }


  const handleLevelChange =(event) => {
    var value =''
    if (event.target.value!=='todos') {
      value = event.target.value
    }
          var clases00 = clasesAll.filter(item => item.instructor.data.profileName.toUpperCase().includes(filterSearchCoach.toUpperCase()))
          var clases01 = clases00.filter(item => item.data.title.toUpperCase().includes(filterSearchClass.toUpperCase()))
          var clases02 = clases01.filter(item => item.startTime>=filterDateTime)

          var clases0 = clases02.filter(item => item.data.type.includes(filtersType));
          var clases1 = clases0.filter(item => item.data.level.includes(value));
          switch (filtersDuration) {
            case '0': var clases2 = clases1.filter(item => (item.data.duration<=30));
              break;
            case '1': var clases2 = clases1.filter(item => (item.data.duration<=60&&item.data.duration>30));
              break;
            case '2': var clases2 = clases1.filter(item => (item.data.duration>60));
              break;
            default: var clases2 = clases1.filter(item => (item.data.duration<=1000));
          }
          setclases(clases2)
          setaux(false)

      setfiltersLevel(value)
  }

  const handleDurationChange =(event) => {
    var value =''
    if (event.target.value!=='todos') {
      value = event.target.value
    }

          var clases00 = clasesAll.filter(item => item.instructor.data.profileName.toUpperCase().includes(filterSearchCoach.toUpperCase()))
          var clases01 = clases00.filter(item => item.data.title.toUpperCase().includes(filterSearchClass.toUpperCase()))
          var clases02 = clases01.filter(item => item.startTime>=filterDateTime)

          var clases0 = clases02.filter(item => item.data.type.includes(filtersType));
          var clases1 = clases0.filter(item => item.data.level.includes(filtersLevel));
          switch (value) {
            case '0': var clases2 = clases1.filter(item => (item.data.duration<=30));
              break;
            case '1': var clases2 = clases1.filter(item => (item.data.duration<=60&&item.data.duration>30));
              break;
            case '2': var clases2 = clases1.filter(item => (item.data.duration>60));
              break;
            default: var clases2 = clases1.filter(item => (item.data.duration<=1000));
          }
          setclases(clases2)
          setaux(false)

      setfiltersDuration(value)
  }

  const  handleDetail = (event) =>{
        var clasesInstructor = props.allClases.filter(item => item.instructor.id.includes(event.target.name));
        var clase = clasesInstructor.filter(item => item.id.includes(event.target.alt))

      setclaseDetail(clase[0])
      setdetail(!detail)
    }

  useEffect(()=>{

    if(props.zoomMeetings&&aux){
      if (clases.length === 0) {
          var Meetings = []
          var now = new Date(Date.now()-3600000).toISOString()
            for (var i = 0; i < props.zoomMeetings.length; i++) {
                var clasesInstructor = props.allClases.filter(item => item.instructor.id.includes(props.zoomMeetings[i].instructor.id));
                var clase = clasesInstructor.filter(item => item.id.includes(props.zoomMeetings[i].claseID))
              Meetings.push({startTime:props.zoomMeetings[i].startTime,
                meetingID: props.zoomMeetings[i].meetingID,
                id: clase[0].id,
                data: clase[0].data,
                instructor: props.zoomMeetings[i].instructor,
                monthlyProgram: props.zoomMeetings[i].monthlyProgram
              })
            }
            setclases(Meetings.sort(sortMeetings))
            setclasesAll(Meetings.sort(sortMeetings))
      }
    }

},[])


  return(

    <div className='d-flex flex-column align-items-center'>
    {console.log(clases)}
      <form className='pt-3'>
        <div className='d-flex flex-row justify-content-end align-items-center flex-wrap'>

            <p className='text-center mr-1 pt-4'><strong>Filtros</strong> <br/><i style={{fontSize:'small',cursor:'pointer'}} onClick={resetFilters}>Quitar</i></p>
            <select id="type"
              name="type"
              onChange={handleTypeChange}
              className='mb-2'
              value={filtersType}
              >
              <option value="todos" >Tipo de ejercicio (Todos)</option>
              <option value="estiramiento">Estiramiento (ej. Yoga)</option>
              <option value="baile">Baile</option>
              <option value="funcional">Funcional</option>
              <option value="pelea">Técnica de pelea</option>
              <option value="pesas">Con pesas</option>
              <option value="otro">Otro</option>
            </select>

          <select id="level"
            name="level"
            className='mb-2'
            onChange={handleLevelChange}
            value={filtersLevel}
            >
            <option value="todos" >Dificultad de la clase (Todas)</option>
            <option value="principiantes">Para principiantes</option>
            <option value="intermedia">Intermedia</option>
            <option value="avanzada">Avanzada</option>
          </select>

          <select id="duration"
            name="duration"
            className='mb-2'
            onChange={handleDurationChange}
            value={filtersDuration}
            >
            <option value='todos'>Duración (Todas)</option>
            <option value={'0'}>0 - 30 min</option>
            <option value={'1'}>30 - 60 min</option>
            <option value={'2'}>Más de 60 min</option>
          </select>

          <div className='d-flex flex-row align-items-center ml-1'>
            <input type='search' placeholder='Buscar coach...' onChange={handleBuscadorCoach} value={filterSearchCoach}/>
          </div>

          <div className='d-flex flex-row align-items-center ml-1'>
            <input type='search' placeholder='Buscar clase...' onChange={handleBuscador} value={filterSearchClass}/>
          </div>

          <input type="datetime-local" className='ml-1' onChange={handleDateTime} value={filterDateTime}/>

        </div>
      </form>

      <div className='p-2 d-flex flex-row flex-wrap justify-content-start'>
      {detail&&claseDetail?
        <div style={{position: 'relative'}} className='p-2 col-12'>
          <InstructorsDetailCard data={claseDetail.data} claseID={claseDetail.id} market={true} instructor={claseDetail.instructor?claseDetail.instructor:props.instructor}/>
          <X className='float-left'size={'2em'} onClick={handleDetail} style={{position: 'absolute', top:'2%', left:'2%',cursor:'pointer'}}/>
        </div>
        :
        clases.length>0?clases.slice(0,showMore).map(clase => (
        <div className={`col-${clases.length>1?'2':'4'}`} key={clase.id+clase.instructor.id+clase.startTime} onClick={handleDetail} style={{cursor:'pointer'}} >
          {props.zoomMeetings?
          <ClassCard title={clase.data.title} picture={clase.data.imgURL} name={clase.instructor?clase.instructor.id:clase.id} id={clase.id} startTime={clase.startTime}/>
          :<ClassCard title={clase.data.title} picture={clase.data.imgURL} name={clase.instructor?clase.instructor.id:clase.id} id={clase.id} />}
        </div>
      )):<h4 style={{color:'gray'}} className='text-center py-5'><i>No hay clases disponibles</i></h4>}
      </div>
      {detail&&claseDetail?null:clases.length>showMore?<button className='btn-secondary rounded col-4' onClick={handleVerMas}>Ver más</button>:null}
    </div>
  )


}

export default MarketAllClasses
