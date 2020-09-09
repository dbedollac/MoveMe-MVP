import React, { useState, useContext, useEffect } from "react";
import { CartPlus } from 'react-bootstrap-icons';
import {Modal, Button} from 'react-bootstrap'
import { Auth } from "../../Config/AuthContext";
import {db} from "../../Config/firestore";
import { withRouter } from "react-router";
import Signup from '../Forms/Signup'
import PayButton from '../Atoms/PayButton'
import { useTranslation } from 'react-i18next';

function AddToCar(props) {
  const { usuario } = useContext(Auth);
  const [show, setShow] = useState(false);
  const curr = new Date()
  const expire = new Date(curr.getFullYear(),curr.getMonth()+1,curr.getDate())
  const { t } = useTranslation();

  const handleClose = () =>{
      setShow(false)
  }

  const searchUsuario = () =>{
    if (usuario) {
        var docRef = db.collection("Users").doc(usuario.uid);
         docRef.get().then((doc)=>{
        if (doc.exists) {
            return console.log("Es usuario")
        } else {
            return setShow(true)
        }
        }).catch(function(error) {
            return console.log("Error getting document:", error);
        });
      }else {
              return setShow(true)
            }
  }

  const handleCart = async () =>{
      await searchUsuario()

      if (usuario&&!show) {
      var docRef = db.collection("Users").doc(usuario.uid).collection('ShoppingCart')
      if(props.claseZoom){
        await docRef.doc().set({
          instructor: props.instructor.data,
          claseData: props.claseZoom,
          meetingID: props.meetingID,
          startTime: props.startTime,
          type: 'Clase por Zoom',
          joinURL: props.joinURL,
          claseID: props.claseID,
          monthlyProgram: props.zoomMonthlyProgram
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
          type: 'Reto Mensual'
        }).catch(error => console.log(error))
      }
    }
  }

  return(
    <>
      <div className='d-flex flex-row align-items-center'>
        <button className={`btn-primary btn-${props.size} mr-1 rounded`} onClick={handleCart}><CartPlus /> {t('addToCar.1','Agregar al Carrito')}</button>
        <PayButton size={props.size}
          subtotal={props.claseZoom?props.claseZoom.zoomPrice:props.claseVideo?props.claseVideo.offlinePrice:props.monthlyProgram?props.instructor?Number(props.instructor.monthlyProgram.Price):null:null}
          type={props.claseZoom?'Zoom':props.claseVideo?'Video':'Reto'}
          products={[{
            data:{instructor: props.monthlyProgram?props.instructor:props.instructor.data,
              claseData: props.claseZoom?props.claseZoom:props.claseVideo?props.claseVideo:null,
              meetingID: props.claseZoom?props.meetingID:null,
              startTime: props.claseZoom?props.startTime:null,
              type: props.claseZoom?'Clase por Zoom':props.claseVideo?'Clase en Video':'Reto Mensual',
              joinURL: props.claseZoom?props.joinURL:null,
              claseID: props.claseZoom?props.claseID:null,
              monthlyProgram: props.claseZoom?props.zoomMonthlyProgram:null},
            expire: expire
          }]}
          trialClass={props.trialClass}
        />
      </div>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Body >
          {usuario? <p>{t('addToCar.2','Debes de cambiar tu tipo de cuenta a "Usuario" para poder realizar compras. Puedes regresar al tipo "Instructor" cuando quieras, tu información no se perderá.')}</p>
          :<Signup />}
        </Modal.Body>
        {usuario?<Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            {t('addToCar.3','Cancelar')}
          </Button>
          <Button variant="primary" onClick={()=>{props.history.push('/account-type')}}>
            {t('addToCar.4','Cambiar tipo de cuenta')}
          </Button>
        </Modal.Footer>:null}
      </Modal>
    </>
  )
}

export default withRouter(AddToCar)
