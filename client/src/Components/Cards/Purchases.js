import React,{useContext, useEffect, useState} from 'react';
import CoachName from '../Atoms/CoachName'
import {db} from '../../Config/firestore'
import { Auth } from "../../Config/AuthContext"
import {Modal, Button, Spinner} from 'react-bootstrap'
import {CheckCircleFill} from 'react-bootstrap-icons'
import Errores from '../Atoms/Errores'
import {proxyurl} from '../../Config/proxyURL'
import { useTranslation } from 'react-i18next';

function CarritoProduct(props) {
  const { usuario } = useContext(Auth);
  const[expireDate,setexpireDate] = useState(null)
  const[purchaseDate,setpurchaseDate] = useState(null)
  const [show, setShow] = useState(false);
  const [loading,setLoading] = useState(false)
  const [refund,setRefund] = useState(null)
  const [refundCause,setrefundCause] = useState(null)
  const [error,setError] = useState(null)
  const [refundSuccess, setrefundSuccess] = useState(false)
  const { t } = useTranslation();

  const handleClose = () => {
    setShow(false)
    if (refundSuccess) {
      window.location.reload(false)
    }
  }
  const handleShow = () => setShow(true);

  const getDate = (date) =>{
    var days = date.getDate().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})
    var month = (date.getMonth()+1).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})
    var year = date.getFullYear()

    return (days+'/'+month+'/'+year)
  }

  const handlerefundCause = (event) =>{
    setrefundCause(event.target.value)
  }

  const handleRefund = () =>{
    setLoading(true)

    fetch(proxyurl+'stripeAPI/refund', {
      method: 'post',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        paymentID: props.paymentID,
        paymentAmount: Math.floor(props.paymentAmount)
      }),
    }).then(function(result) {
        Promise.resolve(result.json()).then((resp) =>{
          if (resp.error) {
            console.log(resp.error)
            setError(t('misCompras.10','Ocurrió un error, mándanos un mail a ayuda@moveme.fitness'))
          } else {
            db.collection('Sales').doc(props.id).set({
              refund:true,
              refundMotive:refundCause
            },{merge:true})
              .then(setrefundSuccess(true))
              .catch(function(error) {
                    console.log("Error: ", error);
                });
          }
        })
      })

  }


  useEffect(()=>{

    if (props.expire) {
      setexpireDate(getDate(props.expire))

      if (props.startTime) {
        var startDate=new Date(props.startTime.startTime)
        setRefund(new Date(startDate.getTime()+(24*7 * 60 * 60 * 1000)))
      }else {
        setRefund(new Date(props.expire.getTime()-(24*14 * 60 * 60 * 1000)))
      }
    }

    if(props.date){
      setpurchaseDate(getDate(props.date))
    }
  },[])

  return(
    <div className='card'>
      <div className='card-body d-flex flex-column flex-md-row align-items-center justify-content-start'>
        <h5 className='col-12 col-md-5'>{props.type.includes('Video')?t('misCompras.21','Clase en Video'):props.type.includes('Zoom')?t('misCompras.22','Clase por Zoom'):t('misCompras.23','Reto Mensual')} {props.startTime?'('+props.startTime.time+')':null}{props.type.includes('Video')||props.type.includes('Reto')?t('misCompras.20','(Vigente hasta ')+expireDate+')':null}</h5>
        <h6 className="card-subtitle mb-2 text-muted col-12 col-md-4">{props.claseData?props.claseData.title:null}</h6>
        <div className='d-flex flex-column align-items-center'>
          <p><strong>{t('misCompras.11','Comprado el ')}{purchaseDate}</strong></p>
          {!props.type.includes('Video')?
            !props.refund?<i style={{cursor:'pointer'}} onClick={handleShow}>{t('misCompras.12','Solicitar reembolso')}</i>:<i>{t('misCompras.13','Reembolsado')}</i>:null}
        </div>
      </div>
      <div className='card-footer d-flex flex-row justify-content-between align-items-center'>
        <CoachName uid={props.instructor.uid} profileName={props.instructor.profileName} profilePicture={props.instructor.imgURL?props.instructor.imgURL:null}/>
        <h5>${props.paymentAmount/100}</h5>
      </div>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>{t('misCompras.14','Reembolsable hasta el ')}{refund?getDate(refund):null}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {t('misCompras.15','Lamentamos el inconveniente que se te haya presentado usando MoveMe, estamos trabajando para mejorar nuestros servicios.')}
          <br/>
          {props.refundsNum<5?
          <textarea
            type="text"
            rows='4'
            placeholder='Compártenos el motivo del reembolso.'
            className='col-12'
            value={refundCause}
            onChange={handlerefundCause}
            required
          />:
          <p>{t('misCompras.16','Mándanos un mail a ')}<i>ayuda@moveme.fitness</i>{t('misCompras.17',' para atender tu caso.')}</p>}
          {refundSuccess?<Errores mensaje='Los rembolsos tardan de 5 a 10 días.' />:<Errores mensaje={error} />}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            {t('misCompras.6','Cancelar')}
          </Button>
          {refundSuccess?<CheckCircleFill color='green' size={'2em'}/>
            :props.refundsNum<5?
            <Button onClick={handleRefund} variant="danger" disabled={refundCause?(new Date()>refund):true}>{loading?<Spinner animation="border" />:t('misCompras.18','Solicitar reembolso')}</Button>
            :null}
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default CarritoProduct
