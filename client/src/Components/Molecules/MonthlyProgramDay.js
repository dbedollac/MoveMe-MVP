import React, { useState, useContext, useEffect } from "react";
import {Button, Modal, Collapse} from 'react-bootstrap'
import CreateZoomMeeting from '../Atoms/CreateZoomMeeting'
import { Search, PlusCircleFill, ChevronCompactDown, ChevronCompactUp } from 'react-bootstrap-icons';
import { Auth } from "../../Config/AuthContext";
import {db, auth} from '../../Config/firestore'
import ClassCard from '../Cards/ClassCard'
import GetZoomMeetings from './GetZoomMeetings'
import './MonthlyProgramDay.css'

function MonthlyProgramDay(props) {
  const { usuario } = useContext(Auth);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [clases, setclases] = useState([])
  const [pictures, setpictures] = useState([])
  const [filtersType, setfiltersType] = useState('')
  const [filtersLevel, setfiltersLevel] = useState('')
  const [filtersDuration, setfiltersDuration] = useState('')
  const [claseDetail, setclaseDetail] = useState(null)
  const [aux, setaux] = useState(true)
  const [open, setOpen] = useState(false);


    useEffect(()=>{
      console.log(usuario);

      auth.onAuthStateChanged((usuario) => {
        if (usuario===null) {
            props.history.push("/login");
        }
      })

      if(usuario&&aux){
      var Clases = []
      var docRef = db.collection("Instructors").doc(usuario.email).collection("Classes");
      docRef.get().then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
               Clases.push({id:doc.id, data: doc.data()});
          });
          setclases(Clases)
      });
    }
  },[usuario])

  const handleBuscador = (event) =>{
    var Clases = []
    var Busca = event.target.value.toUpperCase()
    var docRef = db.collection("Instructors").doc(usuario.email).collection("Classes");
    docRef.get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
             Clases.push({id:doc.id, data: doc.data()});
        });
        var clases = Clases.filter(item => item.data.title.toUpperCase().includes(Busca));
        setclases(clases)
        setaux(false)
    });
  }

  const handleTypeChange =(event) => {
    var value =''
    if (event.target.value!=='todos') {
      value = event.target.value
    }

    const Clases = []
      var docRef = db.collection("Instructors").doc(usuario.email).collection("Classes");
      docRef.get().then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
               Clases.push({id:doc.id, data: doc.data()});
          });
          var clases0 = Clases.filter(item => item.data.type.includes(value));
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
      });

      setfiltersType(value)
  }

  const handleLevelChange =(event) => {
    var value =''
    if (event.target.value!=='todos') {
      value = event.target.value
    }

    const Clases = []
      var docRef = db.collection("Instructors").doc(usuario.email).collection("Classes");
      docRef.get().then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
               Clases.push({id:doc.id, data: doc.data()});
          });
          var clases0 = Clases.filter(item => item.data.type.includes(filtersType));
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
      });

      setfiltersLevel(value)
  }

  const handleDurationChange =(event) => {
    var value =''
    if (event.target.value!=='todos') {
      value = event.target.value
    }

    const Clases = []
      var docRef = db.collection("Instructors").doc(usuario.email).collection("Classes");
      docRef.get().then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
               Clases.push({id:doc.id, data: doc.data()});
          });
          var clases0 = Clases.filter(item => item.data.type.includes(filtersType));
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
      });

      setfiltersDuration(value)
  }

  const  handleDetail = (event) =>{
      var clase = clases.filter(item => item.id.includes(event.target.name));
      setclaseDetail(clase[0])
    }

  return(
    <div className='card-link'>
      <div className='d-flex flex-row justify-content-around align-items-center '>
        <p className='pt-2'><strong>{props.dayName}</strong></p>
        {open?<ChevronCompactUp onClick={() => setOpen(!open)} style={{cursor:'pointer'}} size={'2em'}/>
        :<ChevronCompactDown onClick={() => setOpen(!open)} style={{cursor:'pointer'}} size={'2em'}/>}
      </div>

      <Collapse in={open}>
        <div id="example-collapse-text ">
          <div className ='col-12 d-flex flex-column align-items-center mb-2'>
            <Button variant="outline-primary" onClick={handleShow} className='col-8'>
              Agregar clase <PlusCircleFill/>
            </Button>
          </div>
           <GetZoomMeetings week={props.week} dayNumber={props.dayNumber} />
        </div>
      </Collapse>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
          <div className='col-12'>
            <CreateZoomMeeting meetingType={8} meetingTopic={claseDetail?claseDetail.data.title:null} week={props.week} dayNumber={props.dayNumber} dayName={props.dayName} claseID={claseDetail?claseDetail.id:null}/>
          </div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className='d-flex flex-row flex-wrap justify-content-start search-container'>
            <div className='d-flex flex-row align-items-center ml-1 mt-3'>
              <Search className='mr-2'/>
              <input type='search' placeholder='Buscar clase...' onChange={handleBuscador}/>
              <i className='ml-1'>{claseDetail?claseDetail.data.title:null}</i>
            </div>
            <form className='pt-3'>

                  <select id="type"
                    name="type"
                    onChange={handleTypeChange}
                    className='m-1'
                    >
                    <option value="todos" selected>Tipo de ejercicio (Todos)</option>
                    <option value="estiramiento">Estiramiento (ej. Yoga)</option>
                    <option value="baile">Baile</option>
                    <option value="funcional">Funcional</option>
                    <option value="pelea">Técnica de pelea</option>
                    <option value="pesas">Con pesas</option>
                    <option value="otro">Otro</option>
                  </select>

                <select id="level"
                  name="level"
                  className='m-1'
                  onChange={handleLevelChange}
                  >
                  <option value="todos" selected>Dificultad de la clase (Todas)</option>
                  <option value="principiantes">Para principiantes</option>
                  <option value="intermedia">Intermedia</option>
                  <option value="avanzada">Avanzada</option>
                </select>

                <select id="duration"
                  name="duration"
                  className='m-1'
                  onChange={handleDurationChange}
                  >
                  <option value='todos' selected>Duración (Todas)</option>
                  <option value={'0'}>0 - 30 min</option>
                  <option value={'1'}>30 - 60 min</option>
                  <option value={'2'}>Más de 60 min</option>
                </select>
            </form>
            {clases?clases.map(clase => (
              <div className='col-3' key={clase.id} onClick={handleDetail} style={{cursor:'pointer'}} >
                <ClassCard title={clase.data.title} picture={clase.data.imgURL} name={clase.id}/>
              </div>
            )):null}
          </div>
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default MonthlyProgramDay