import React, { useState, useContext, useEffect } from "react";
import {db,auth} from '../../Config/firestore'
import { Auth } from "../../Config/AuthContext";
import {Button, Modal} from 'react-bootstrap'

function MonthlyProgramStatus(props) {
  const { usuario } = useContext(Auth);
  const [active, setActive] = useState(false)
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(()=>{
    if (usuario) {
    var docRef = db.collection("Instructors").doc(usuario.uid);
      docRef.get().then((doc)=> {
          if (doc.exists) {
            setActive(doc.data().monthlyProgram.Active)
          } else {
              console.log("No such document!");
          }
      }).catch(function(error) {
          console.log("Error getting document:", error);
      });
    }
  },[usuario])

  const handleSave = () =>{
    db.collection("Instructors").doc(usuario.uid).set({
      monthlyProgram: {
        Active: !active
      }
    },{ merge: true }).then(
    ).catch(error => console.log(error))
    window.location.reload(false)
  }

  return(
    <div className={`p-2 rounded d-flex flex-column border border-${active?`primary`:`danger`}`} style={{backgroundColor: 'white'}}>
        <p><strong>Estatus:</strong> {active?'Activo':'Inactivo'}</p>
        <button className={`col-12 btn-${active?`secondary`:`danger`}`} onClick={active?handleShow:handleShow}>{active?'Desactivar':'Activar'}</button>

        <Modal
          show={show}
          onHide={handleClose}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
          <Modal.Title>{active?'Desactivar programa mensual':'Activar programa mensual'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>{active?'¿Deseas desactivar tu programa? Se cancelará el cobro mensual a todos tus clientes suscritos y no podrán acceder a tu contenido.':
        'A partir del próximo domingo se activará tu programa para que obtengas nuevos miembros y todas las clases que agendaste se ofreceran individualmente para compras por asistencia.'}
          </Modal.Body>
          <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Cancelar</Button>
          <Button variant={active?"danger":'primary'} onClick={handleSave}>{active?'Desactivar':'Activar'}</Button>
          </Modal.Footer>
        </Modal>
    </div>
  )
}

export default MonthlyProgramStatus
