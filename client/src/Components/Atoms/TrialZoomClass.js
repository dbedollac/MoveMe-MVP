import React,{useState,useContext} from 'react'
import {db} from '../../Config/firestore'
import { Auth } from "../../Config/AuthContext";
import { CameraVideoFill, CheckCircleFill} from 'react-bootstrap-icons';
import { Spinner, Modal, Button} from 'react-bootstrap'
import Login from '../Forms/Login'
import SalesUserMail from '../Atoms/SalesUserMail'
import {withRouter} from 'react-router'

function TrialZoomClass(props) {
  const { usuario } = useContext(Auth);
  const curr = new Date()
  const expire = new Date(curr.getFullYear(),curr.getMonth()+1,curr.getDate())
  const [loading,setLoading] = useState(false)
  const [success,setSuccess] =  useState(false)

  const addSales = async () =>{
    await setLoading(true)
      await db.collection('Sales').doc().set({
        data: props.product.data,
        instructor: {uid:props.product.data.instructor.uid, email: props.product.data.instructor.email},
        type: 'Clase por Zoom',
        price: 0,
        user: {uid:usuario.uid, email:usuario.email},
        expire: expire.toISOString(),
        date: curr.toISOString(),
        settle: true,
        refund: false,
        movemeFee: 0
      }).then(setSuccess(true))

      await db.collection('Users').doc(usuario.uid).set({
        trialClass:1
      },{merge:true})

      //Mail a los usuarios
      await db.collection('Mails').doc().set({
        to:[usuario.email],
        message:{
          subject:'Tu Clase por Zoom '+props.product.data.claseData.title,
          html: SalesUserMail('Clase por Zoom', props.product.data, expire.toISOString())
        }
      })

      props.history.push('/ZoomClasses')
  }

  return(
    <div>
      <p>¡Toma tu primer <strong>clase de prueba GRATIS!</strong> ¿Quieres que <strong>{props.product.data.claseData.title}</strong> a las <strong>{props.product.data.startTime.time}</strong> sea tu clase de prueba?</p>
      <div className='mt-2 d-flex flex-row justify-content-center'>
      {loading&&!success?<Spinner animation="border" />
        :success?<CheckCircleFill color='green' size={'2em'}/>
        :<button className='btn-success rounded' onClick={addSales}><CameraVideoFill/> Tomar clase prueba</button>}
      </div>
    </div>
  )
}

export default withRouter(TrialZoomClass)
