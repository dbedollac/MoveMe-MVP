import React,{useState,useContext} from 'react'
import {db} from '../../Config/firestore'
import { Auth } from "../../Config/AuthContext";
import { PlusCircleFill, CheckCircleFill} from 'react-bootstrap-icons';
import { Spinner, Modal, Button} from 'react-bootstrap'
import Login from '../Forms/Login'
import {withRouter} from 'react-router'
import { useTranslation } from 'react-i18next';

function AddFreeVideo(props) {
  const { usuario } = useContext(Auth);
  const curr = new Date()
  const expire = new Date(curr.getFullYear(),curr.getMonth()+1,curr.getDate())
  const [loading,setLoading] = useState(false)
  const [success,setSuccess] =  useState(false)
  const [show, setShow] = useState(false);
  const { t } = useTranslation();

  const handleClose = () =>{
      setShow(false)
  }

  const searchUsuario = () =>{
    if (usuario) {
        var docRef = db.collection("Users").doc(usuario.uid);
         docRef.get().then((doc)=>{
        if (doc.exists) {
            addSales()
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

  const addSales = () =>{
     setLoading(true)
      db.collection('Sales').doc().set({
        data: props.product.data,
        instructor: {uid:props.product.data.instructor.uid, email: props.product.data.instructor.email},
        type: 'Clase en Video',
        price: 0,
        user: {uid:usuario.uid, email:usuario.email},
        expire: expire.toISOString(),
        date: curr.toISOString(),
        settle: true,
        refund: false
      }).then(setSuccess(true))
  }

  return(
    <div>
      {loading&&!success?<Spinner animation="border" />
        :success?<CheckCircleFill color='green' size={'2em'}/>
        :<button className={`btn-info rounded`} onClick={searchUsuario}><PlusCircleFill/> {t('iCard.12','Agregar a Mis Videos')}</button>}

        <Modal
          show={show}
          onHide={handleClose}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Body >
            {usuario? <p>{t('iCard.13','Debes de cambiar tu tipo de cuenta a "Usuario" para poder realizar compras. Puedes regresar al tipo "Instructor" cuando quieras, tu información no se perderá.')}</p>
            :<Login />}
          </Modal.Body>
          {usuario?<Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              {t('iCard.14','Cancelar')}
            </Button>
            <Button variant="primary" onClick={()=>{props.history.push('/account-type')}}>
              {t('iCard.15','Cambiar tipo de cuenta')}
            </Button>
          </Modal.Footer>:null}
        </Modal>
    </div>
  )
}

export default withRouter(AddFreeVideo)
