import React,{useState,useContext} from 'react'
import {Modal, Button} from 'react-bootstrap'
import { CheckSquare } from 'react-bootstrap-icons';
import StripeFee from '../Atoms/StripeFee'
import PaymentForm from '../Forms/PaymentForm'
import Login from '../Forms/Login'
import { Auth } from "../../Config/AuthContext";
import {db} from "../../Config/firestore";
import { withRouter } from "react-router";

function PayButton(props) {
  const { usuario } = useContext(Auth);
  const [show, setShow] = useState(false);
  const [showLogin,setshowLogin] = useState(false)
  const curr = new Date()
  const expire = new Date(curr.getFullYear(),curr.getMonth()+1,curr.getDate())

  var days = expire.getDate().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})
  var month = (expire.getMonth()+1).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})
  var year = expire.getFullYear()
  const [expireDate] = useState(days+'/'+month+'/'+year)

  const handleClose = () => setShow(false);
  const handleCloseLogin = () => setshowLogin(false);
  const handleShowLogin = () => setshowLogin(true);

  const searchUsuario = () =>{
    if (usuario) {
        var docRef = db.collection("Users").doc(usuario.uid);
         docRef.get().then((doc)=>{
        if (doc.exists) {
            setShow(true)
        } else {
            setshowLogin(true)
        }
        }).catch(function(error) {
            return console.log("Error getting document:", error);
        });
      }else {
              setshowLogin(true)
            }
  }

  return(
    <>
      <button className={`btn-info btn-${props.size} rounded`} onClick={searchUsuario}><CheckSquare/> {props.cart?'Proceder al pago':'Comprar ahora'}</button>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Total a pagar: ${(props.subtotal+StripeFee(props.subtotal)).toFixed(2)}<br/>
          {!props.cart?<p style={{color:'gray',fontSize:'small'}}>(Tarifa por transacción: ${StripeFee(props.subtotal).toFixed(2)})</p>:null}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <PaymentForm total={(props.subtotal+StripeFee(props.subtotal)).toFixed(2)}/>
        </Modal.Body>
        {!props.cart?props.type!=='Zoom'?
        <Modal.Footer>
          <h5>Vigente hasta {expireDate}</h5>
        </Modal.Footer>:null:null}
      </Modal>

      <Modal
        show={showLogin}
        onHide={handleCloseLogin}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Body >
          {usuario? <p>Debes de cambiar tu tipo de cuenta a "Usuario" para poder realizar compras. Puedes regresar al tipo "Instructor" cuando quieras, tu información no se perderá.</p>
          :<Login />}
        </Modal.Body>
        {usuario?<Modal.Footer>
          <Button variant="secondary" onClick={handleCloseLogin}>
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

export default withRouter(PayButton)
