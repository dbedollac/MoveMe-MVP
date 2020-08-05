import React, { useState, useContext, useEffect } from "react";
import { CartPlus } from 'react-bootstrap-icons';
import {Modal, Button} from 'react-bootstrap'
import { Auth } from "../../Config/AuthContext";
import {db} from "../../Config/firestore";
import { withRouter } from "react-router";
import Login from '../Forms/Login'

function AddToCar(props) {
  const { usuario } = useContext(Auth);
  const [show, setShow] = useState(false);

  const handleClose = () =>{
      setShow(false)
  }

  const searchUsuario = () =>{
    if (usuario) {
        var docRef = db.collection("Users").doc(usuario.uid);
         docRef.get().then((doc)=>{
        if (doc.exists) {
            console.log("Es usuario")
        } else {
            setShow(true)
        }
        }).catch(function(error) {
            return console.log("Error getting document:", error);
        });
      }else {
              setShow(true)
            }
  }

  const handleCart = async () =>{
      await searchUsuario()

      if (usuario) {
      var docRef = db.collection("Users").doc(usuario.uid).collection('ShoppingCart')
      if(props.claseZoom){
        await docRef.doc().set({
          instructor: props.instructor.data,
          claseData: props.claseZoom,
          meetingID: props.meetingID,
          startTime: props.startTime,
          type: 'Clase por Zoom'
        }).catch(error => console.log(error))
      }

      if(props.claseVideo){
        await docRef.doc().set({
          instructor: props.instructor.data,
          claseData: props.claseVideo,
          type: 'Clase en Video'
        }).catch(error => console.log(error))
      }

      if (props.monthlyProgram) {
        await docRef.doc().set({
          instructor: props.instructor,
          type: 'Programa Mensual'
        }).catch(error => console.log(error))
      }
    }
  }

  return(
    <>
      <button className={`btn-primary btn-${props.size}`} onClick={handleCart}><CartPlus /> Agregar al Carrito</button>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Body >
          {usuario? <p>Debes de cambiar tu tipo de cuenta a "Usuario" para poder realizar compras. Puedes regresar al tipo "Instructor" cuando quieras, tu información no se perderá.</p>
          :<Login />}
        </Modal.Body>
        {usuario?<Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={()=>{props.history.push('/account-type')}}>
            Cambiar tipo de cuenta
          </Button>
        </Modal.Footer>:null}
      </Modal>
    </>
  )
}

export default withRouter(AddToCar)
