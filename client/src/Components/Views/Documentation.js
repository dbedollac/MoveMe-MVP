import React,{useState,useEffect,useContext} from 'react'
import { withRouter } from "react-router";
import Header from '../Molecules/Header'
import {CaretDownSquareFill, PersonSquare, GearFill, CollectionPlayFill, Calendar3Fill, Wallet2} from 'react-bootstrap-icons';
import { useTranslation } from 'react-i18next';
import './Ayuda.css'

function Documentation(props) {
  const { t } = useTranslation();

  return (
    <>
    {props.empty?null:<Header />}
      <div className='p-3 TerminosCondiciones-container text-justify'>
        <h3 className='text-center'>{t('docu.1','Documentación para instructores')}<img src='./Instructor.png' alt='Instructor' style={{width:'50px'}}/></h3>
        <h4 className='mt-3'>{t('docu.2','1) ¿Cómo instalar MoveMe y enlazar mi cuenta de Zoom?')}</h4>
        <ol>
          <li>{t('docu.3','Regístrate con una cuenta tipo "Instructor".')}</li>
          <li>{t('docu.4','En configuración')} <GearFill /> {t('docu.5','ingresa los datos para generar tu perfil y después selecciona el botón "Enlazar mi cuenta Zoom".')}</li>
          <li>{t('docu.6','MoveMe te redirigirá a una página de Zoom para que selecciones la cuenta que quieres enlazar.')}</li>
          <li>{t('docu.7','Una vez enlazada tu cuenta regresarás a la página de tu perfil en MoveMe y habrás concluido la instalación.')}</li>
        </ol>
        <h4 className='mt-3'>{t('docu.8','2) ¿Cómo utilizar MoveMe?')}</h4>
        <h5 className='mt-3'><PersonSquare/> {t('docu.24','Perfil')}</h5>
        <p>{t('docu.25','En tu perfil puedes ver cómo se ven los datos que ingresaste en configuración, así como un resumen de tus servicios fitness. Aparecen tus próximas clases por Zoom y desde aquí puedes iniciar las sesiones al hacer click en ellas.')}</p>
        <h5 className='mt-3'><CollectionPlayFill/> {t('docu.9','Mis Clases')}</h5>
        <p>{t('docu.10','En esta sección podrás ver todas las clases que has creado, crear nuevas clases, editar las existentes y agendar clases por Zoom de una ocurrencia:')}</p>
        <ul>
          <li><strong>{t('docu.11','Ver clases:')}</strong> {t('docu.12','En esta página aparecerán las miniaturas de todas las clases que hayas creado, para ver los detalles de alguna selecciónala.')}</li>
          <li><strong>{t('docu.13','Crear nueva clase:')}</strong> {t('docu.14','Selecciona "Nueva Clase" y aparecerá una venta donde poner el nombre de la clase, sus caracterísitcas, podrás subir la portada de su miniatura y el video de la clase para rentar. En esta ventana fijarás los precios de la renta del video y asistencias a clases por Zoom.')}</li>
          <li><strong>{t('docu.15','Editar clase:')}</strong> {t('docu.16','Al seleccionar una clase te aparecerá la opción "Editar Clase", al elegirla se desplegará una ventana igual a la de cuando creaste la clase, pero con los datos actuales de la clase. Modifícalos y guarda para editar la clase.')}</li>
          <li><strong>{t('docu.17','Agendar clase por Zoom:')}</strong> {t('docu.18','Al seleccionar una clase aparecerá un calendario para seleccionar fecha y hora de una sesión por Zoom para dar esa clase. Al guardar la fecha y hora, se agendará la clase de una sola ocurrencia.')}</li>
        </ul>
        <h5 className='mt-3'><CollectionPlayFill/> {t('docu.19','Mi Reto')}</h5>
        <p>{t('docu.20','En esta página es donde crearás tu reto mensual. Selecciona una semana del mes y un día de la semana, luego haz click en "Agregar clase" y elige una de tus clases para agendar una sesión de Zoom a la hora que decidas, ese día. Esta clase se reagendará todos los meses la misma semana y día de la semana. Repite este proceso hasta crear un reto.')}</p>
        <p>{t('docu.21','Después de que agendes todas las clases por Zoom, fija el precio de tu reto. Los usuarios que adquieran tu reto, tendrán acceso a todas las clases por Zoom del mes, así como a todos los videos que hayas subido a MoveMe.')}</p>
        <h5 className='mt-3'><Wallet2/> {t('docu.22','Ventas')}</h5>
        <p>{t('docu.23','En esta página podrás ver el resumén de tus ventas. Selecciona desde cuando quieres ver el registro de ventas y observa cuánto has vendido de retos, clases por Zoom y videos rentados. Revisa cuántas ganancias te faltan por recibir y los emails de los clientes que hayan pagado por tu reto para que te mantengas en contacto.')}</p>
        <h5 className='mt-3'><CaretDownSquareFill/> {t('docu.26','Más opciones')}</h5>
        <ul>
          <li><strong>{t('docu.27','Ver mi página comercial:')}</strong> {t('docu.28','Observa cómo ven tus clientes tu perfil y cómo pueden comprar tus servicios fitness.')}</li>
          <li><strong>{t('docu.29','Configuración:')}</strong> {t('docu.30','Modifica los datos de tu perfil o enlázate a otra cuenta de Zoom.')}</li>
          <li><strong>{t('docu.31','¿Cómo inicio?:')}</strong> {t('docu.32','Te compartimos los primeros 5 pasos para que inicies tu negocio fitness digital.')}</li>
          <li><strong>{t('docu.33','Ayuda:')}</strong> {t('docu.34','Documentación y correo de ayuda.')}</li>
          <li><strong>{t('docu.35','English:')}</strong> {t('docu.36','Cambia el idioma de MoveMe a inglés.')}</li>
          <li><strong>{t('docu.37','Cambiar tipo de cuenta:')}</strong> {t('docu.38','Cambia tu tipo de cuenta a usuario para que puedas adquirir los servicios fitness de otros instructores.')}</li>
        </ul>
        <h4 className='mt-3'>{t('docu.39','3) ¿Cómo desenlazar mi cuenta de Zoom?')}</h4>
        <ol>
          <li>{t('docu.40')}</li>
          <li>{t('docu.41')}</li>
          <li>{t('docu.42')}</li>
          <li>{t('docu.43')}</li>
        </ol>
        <p>{t('docu.44')}</p>
      </div>
    </>
  )
}

export default withRouter(Documentation)
