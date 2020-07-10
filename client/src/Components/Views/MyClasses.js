import React from 'react';
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

class MyClasses extends React.Component {
static contextType = Auth

  constructor() {
    super()
    this.state = {
      newclass: false,
      clases: [],
      pictures: [],
      filtersType: '',
      filtersLevel: '',
      filtersDuration: '',
      detail: false,
      claseDetail: null,
      editClass: false,
      searching: false
      }
    }


  async componentDidMount(){
    let user = this.context.usuario;
    console.log(user);

    auth.onAuthStateChanged((user) => {
      if (user===null) {
          this.props.history.push("/login");
      }
    })

    if (user&&!this.state.searching) {
      var Clases = []
      var docRef = db.collection("Instructors").doc(user.email).collection("Classes");
      docRef.get().then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
               Clases.push({id:doc.id, data: doc.data()});
          });
          this.setState({
            clases: Clases,
          })
      });
    }

  }

  componentDidUpdate(){
    let user = this.context.usuario;
    if (user&&!this.state.searching) {
      var Clases = []
      var docRef = db.collection("Instructors").doc(user.email).collection("Classes");
      docRef.get().then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
               Clases.push({id:doc.id, data: doc.data()});
          });
          this.setState({
            clases: Clases,
          })
      });
    }
  }

  handleClick = () =>{
    this.setState({
      newclass: true
    })
  }

  handleBuscador = (event) =>{
    let user = this.context.usuario;
    var Clases = []
    var Busca = event.target.value.toUpperCase()
    var docRef = db.collection("Instructors").doc(user.email).collection("Classes");
    docRef.get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
             Clases.push({id:doc.id, data: doc.data()});
        });
        var clases = Clases.filter(item => item.data.title.toUpperCase().includes(Busca));
        this.setState({clases: clases})
    });
    this.setState({searching:true})
  }

  handleTypeChange =(event) => {
    let user = this.context.usuario;
    var value =''
    if (event.target.value!=='todos') {
      value = event.target.value
    }

    const Clases = []
      var docRef = db.collection("Instructors").doc(user.email).collection("Classes");
      docRef.get().then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
               Clases.push({id:doc.id, data: doc.data()});
          });
          var clases0 = Clases.filter(item => item.data.type.includes(value));
          var clases1 = clases0.filter(item => item.data.level.includes(this.state.filtersLevel));
          switch (this.state.filtersDuration) {
            case '0': var clases2 = clases1.filter(item => (item.data.duration<=30));
              break;
            case '1': var clases2 = clases1.filter(item => (item.data.duration<=60&&item.data.duration>30));
              break;
            case '2': var clases2 = clases1.filter(item => (item.data.duration>60));
              break;
            default: var clases2 = clases1.filter(item => (item.data.duration<=1000));
          }
          this.setState({clases: clases2})
      });

      this.setState({
        filtersType : value,
        searching: true
        }
      )
  }


  handleLevelChange =(event) => {
    let user = this.context.usuario;
    var value =''
    if (event.target.value!=='todos') {
      value = event.target.value
    }

    const Clases = []
      var docRef = db.collection("Instructors").doc(user.email).collection("Classes");
      docRef.get().then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
               Clases.push({id:doc.id, data: doc.data()});
          });
          var clases0 = Clases.filter(item => item.data.type.includes(this.state.filtersType));
          var clases1 = clases0.filter(item => item.data.level.includes(value));
          switch (this.state.filtersDuration) {
            case '0': var clases2 = clases1.filter(item => (item.data.duration<=30));
              break;
            case '1': var clases2 = clases1.filter(item => (item.data.duration<=60&&item.data.duration>30));
              break;
            case '2': var clases2 = clases1.filter(item => (item.data.duration>60));
              break;
            default: var clases2 = clases1.filter(item => (item.data.duration<=1000));
          }
          this.setState({clases: clases2})
      });

      this.setState({
        filtersLevel : value,
        searching: true
        }
      )
  }

  handleDurationChange =(event) => {
    let user = this.context.usuario;
    var value =''
    if (event.target.value!=='todos') {
      value = event.target.value
    }

    const Clases = []
      var docRef = db.collection("Instructors").doc(user.email).collection("Classes");
      docRef.get().then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
               Clases.push({id:doc.id, data: doc.data()});
          });
          var clases0 = Clases.filter(item => item.data.type.includes(this.state.filtersType));
          var clases1 = clases0.filter(item => item.data.level.includes(this.state.filtersLevel));
          switch (value) {
            case '0': var clases2 = clases1.filter(item => (item.data.duration<=30));
              break;
            case '1': var clases2 = clases1.filter(item => (item.data.duration<=60&&item.data.duration>30));
              break;
            case '2': var clases2 = clases1.filter(item => (item.data.duration>60));
              break;
            default: var clases2 = clases1.filter(item => (item.data.duration<=1000));
          }
          this.setState({clases: clases2})
      });

      this.setState({
        filtersDuration : value,
        searching: true
        }
      )
  }

  handleDetail = (event) =>{
    var clase = this.state.clases.filter(item => item.id.includes(event.target.name));
    this.setState((state)=>({
      detail: !this.state.detail,
      claseDetail: clase[0]
    }))
  }

  handleEditClass = ()=>{
    this.setState((state)=>({
      editClass: !this.state.editClass,
    }))
  }

  render(){
    if (this.state.editClass&&this.state.detail) {
      return(
        <div>
          <Header type={1} />
          <div className='d-flex flex-row align-items-center'>
            <h2 className='col-10 text-center text-break' style={{color: '#F39119'}}>{this.state.claseDetail.data.title}</h2>
            <button className='col-2 float-right btn-lg btn-secondary mt-2 mr-2' onClick={this.handleEditClass}><ArrowLeft /> Regresar</button>
          </div>
          <EditClass claseID={this.state.claseDetail.id} claseData={this.state.claseDetail.data} />
        </div>
      )
    }
    if (this.state.newclass) {
    return(
      <Redirect to='nuevaclase' />
    )
    } else {
    return (
      <div>
        <Header type={1} />
          <div className='col-12 MyClasses-container d-flex flex-row'>
             <div className='col-3 MyClasses-summary d-flex flex-column justify-content-start py-2'>
             {!this.state.detail?
              <div className='my-1'>
                <h2 className='text-center'>{this.state.clases.length} clases</h2>
                <div className='d-flex flex-row align-items-center'>
                  <Search className='mr-2'/>
                  <input type='search' placeholder='Buscar clase...' onChange={this.handleBuscador}/>
                </div>
                <form className='pt-3'>
                  <div className='d-flex flex-column justify-content-between'>
                    <p className='text-center'><i>Filtros</i></p>

                      <select id="type"
                        name="type"
                        onChange={this.handleTypeChange}
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
                      onChange={this.handleLevelChange}
                      >
                      <option value="todos" selected>Dificultad de la clase (Todas)</option>
                      <option value="principiantes">Para principiantes</option>
                      <option value="intermedia">Intermedia</option>
                      <option value="avanzada">Avanzada</option>
                    </select>

                    <select id="duration"
                      name="duration"
                      className='mb-2'
                      onChange={this.handleDurationChange}
                      >
                      <option value='todos' selected>Duración (Todas)</option>
                      <option value={'0'}>0 - 30 min</option>
                      <option value={'1'}>30 - 60 min</option>
                      <option value={'2'}>Más de 60 min</option>
                    </select>
                  </div>
                </form>
                <div className='d-flex flex-row mt-5 align-items-center justify-content-center'>
                  <PlusCircleFill size={'3em'} className='mr-2' onClick={this.handleClick} style={{cursor:'pointer'}}/>
                  <h3>Nueva Clase</h3>
                </div>
              </div>
              :
              <div className='d-flex flex-column'>
                <CreateZoomMeeting />
                <button className='btn-lg btn-secondary my-3' onClick={this.handleEditClass}>Editar clase <PencilSquare /></button>
              </div> }
            </div>

            <div className='p-2 d-flex flex-row flex-wrap justify-content-start clases-container'>
            {this.state.detail&&this.state.claseDetail?
              <div style={{position: 'relative'}}>
                <InstructorsDetailCard data={this.state.claseDetail.data}/>
                <X className='float-left'size={'2em'} onClick={this.handleDetail} style={{position: 'absolute', top:'0%', left:'0%',cursor:'pointer'}}/>
              </div>:

            this.state.clases?this.state.clases.reverse().map(clase => (
              <div className='col-3' key={clase.id} onClick={this.handleDetail} style={{cursor:'pointer'}}>
                <ClassCard title={clase.data.title} picture={clase.data.imgURL} name={clase.id}/>
              </div>
            )):null}
            </div>
          </div>
      </div>
    )}
  }
}

export default withRouter(MyClasses)
