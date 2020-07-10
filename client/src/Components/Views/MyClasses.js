import React, { useState, useContext, useEffect } from "react";
import Header from '../Molecules/Header'
import { Auth } from "../../Config/AuthContext";
import {db, auth} from '../../Config/firestore'
import { withRouter } from "react-router";
import {Redirect} from "react-router-dom";
import './MyClasses.css'
import NewClass from './NewClass'
import { PlusCircleFill, Search, X, PencilSquare, ArrowLeft } from 'react-bootstrap-icons';
import ClassCard from '../Cards/ClassCard'
import InstructorsDetailCard from '../Cards/InstructorsDetailCard'
import EditClass from '../Molecules/EditClass'
import CreateZoomMeeting from '../Atoms/CreateZoomMeeting'

function MyClasses(props) {
const { usuario } = useContext(Auth);
const [newclass, setNewClass] = useState(false)
const [clases, setclases] = useState([])
const [pictures, setpictures] = useState([])
const [filtersType, setfiltersType] = useState('')
const [filtersLevel, setfiltersLevel] = useState('')
const [filtersDuration, setfiltersDuration] = useState('')
const [detail, setdetail] = useState(false)
const [claseDetail, setclaseDetail] = useState(null)
const [editClass, seteditClass] = useState(false)
const [aux, setaux] = useState(true)


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
})



  const handleNewClass = () =>{
    setNewClass(!newclass)
  }

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
    setdetail(!detail)
    setclaseDetail(clase[0])
  }

const handleEditClass = ()=>{
    seteditClass(!editClass)
  }

    if (editClass&&detail) {
      return(
        <div>
          <Header type={1} />
          <div className='d-flex flex-row align-items-center'>
            <h2 className='col-10 text-center text-break' style={{color: '#F39119'}}>{claseDetail.data.title}</h2>
            <button className='col-2 float-right btn-lg btn-secondary mt-2 mr-2' onClick={handleEditClass}><ArrowLeft /> Regresar</button>
          </div>
          <EditClass claseID={claseDetail.id} claseData={claseDetail.data} />
        </div>
      )
    }
    if (newclass) {
      return(
        <div>
          <Header type={1} />
          <div className='d-flex flex-row align-items-center'>
            <h2 className='col-10 text-center text-break' style={{color: '#F39119'}}>Clase Nueva</h2>
            <button className='col-2 float-right btn-lg btn-secondary mt-2 mr-2' onClick={handleNewClass}><ArrowLeft /> Regresar</button>
          </div>
          <NewClass />
        </div>
      )
    } else {
    return (
      <div>
        <Header type={1} />
          <div className='col-12 MyClasses-container d-flex flex-row'>
             <div className='col-3 MyClasses-summary d-flex flex-column justify-content-start py-2'>
             {!detail?
              <div className='my-1'>
                <h2 className='text-center'>{clases.length} clases</h2>
                <div className='d-flex flex-row align-items-center'>
                  <Search className='mr-2'/>
                  <input type='search' placeholder='Buscar clase...' onChange={handleBuscador}/>
                </div>
                <form className='pt-3'>
                  <div className='d-flex flex-column justify-content-between'>
                    <p className='text-center'><i>Filtros</i></p>

                      <select id="type"
                        name="type"
                        onChange={handleTypeChange}
                        className='mb-2'
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
                      className='mb-2'
                      onChange={handleLevelChange}
                      >
                      <option value="todos" selected>Dificultad de la clase (Todas)</option>
                      <option value="principiantes">Para principiantes</option>
                      <option value="intermedia">Intermedia</option>
                      <option value="avanzada">Avanzada</option>
                    </select>

                    <select id="duration"
                      name="duration"
                      className='mb-2'
                      onChange={handleDurationChange}
                      >
                      <option value='todos' selected>Duración (Todas)</option>
                      <option value={'0'}>0 - 30 min</option>
                      <option value={'1'}>30 - 60 min</option>
                      <option value={'2'}>Más de 60 min</option>
                    </select>
                  </div>
                </form>
                <div className='d-flex flex-row mt-5 align-items-center justify-content-center'>
                  <PlusCircleFill size={'3em'} className='mr-2' onClick={handleNewClass} style={{cursor:'pointer'}}/>
                  <h3>Nueva Clase</h3>
                </div>
              </div>
              :
              <div className='d-flex flex-column'>
                <CreateZoomMeeting />
                <button className='btn-lg btn-secondary my-3' onClick={handleEditClass}>Editar clase <PencilSquare /></button>
              </div> }
            </div>

            <div className='p-2 d-flex flex-row flex-wrap justify-content-start clases-container'>
            {detail&&claseDetail?
              <div style={{position: 'relative'}}>
                <InstructorsDetailCard data={claseDetail.data}/>
                <X className='float-left'size={'2em'} onClick={handleDetail} style={{position: 'absolute', top:'0%', left:'0%',cursor:'pointer'}}/>
              </div>:

            clases?clases.reverse().map(clase => (
              <div className='col-3' key={clase.id} onClick={handleDetail} style={{cursor:'pointer'}}>
                <ClassCard title={clase.data.title} picture={clase.data.imgURL} name={clase.id}/>
              </div>
            )):null}
            </div>
          </div>
      </div>
    )}

}

export default withRouter(MyClasses)