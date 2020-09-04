import React, { useState, useContext, useEffect } from "react";
import {db,auth} from '../../Config/firestore'
import { Auth } from "../../Config/AuthContext";
import {Button, Modal} from 'react-bootstrap'
import { useTranslation } from 'react-i18next';

function MonthlyProgramStatus(props) {
  const { usuario } = useContext(Auth);
  const [active, setActive] = useState(false)
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const { t } = useTranslation();

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
        <p><strong>{t('mPrice.9','Estatus')}:</strong> {active?t('mPrice.10','Activo'):t('mPrice.11','Inactivo')}</p>
        <button className={`col-12 btn-${active?`secondary`:`danger`}`} onClick={active?handleShow:handleShow} disabled={props.disabled}>{active?t('mPrice.12','Desactivar'):t('mPrice.13','Activar')}</button>

        <Modal
          show={show}
          onHide={handleClose}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
          <Modal.Title>{active?t('mPrice.14','Desactivar reto mensual'):t('mPrice.15','Activar reto mensual')}</Modal.Title>
          </Modal.Header>
          <Modal.Body>{active?t('mPrice.16','¿Deseas desactivar tu reto? Se cancelará el cobro a tus clientes suscritos y no podrán acceder a tu contenido.'):
            t('mPrice.17','Al activar tu reto, este se ofrecerá automáticamente a todos los usuarios de MoveMe y las clases que agendaste se ofrecerán individualmente para compras por asistencia.')}
          </Modal.Body>
          <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>{t('mPrice.18','Cancelar')}</Button>
          <Button variant={active?"danger":'primary'} onClick={handleSave}>{active?t('mPrice.12','Desactivar'):t('mPrice.13','Activar')}</Button>
          </Modal.Footer>
        </Modal>
    </div>
  )
}

export default MonthlyProgramStatus
