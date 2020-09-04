import React,{useState,useEffect,useContext} from 'react'
import { withRouter } from "react-router";
import { Auth } from "../../Config/AuthContext";
import Header from '../Molecules/Header'
import facebookLogo from '../Views/Images/Facebook.png'
import instagramLogo from '../Views/Images/Instagram.png'
import { useTranslation } from 'react-i18next';
import './Ayuda.css'

function Ayuda(props) {
  const { usuario } = useContext(Auth);
  const { t } = useTranslation();

  return (
    <>
    <Header empty={usuario?true:false}/>
      <div className='Ayuda-container p-4'>
        <p>{t('help.1','Hola')}, <strong>{t('help.2','escríbenos a ')}<a href='mailto:ayuda@moveme.fitness'>ayuda@moveme.fitness</a></strong>{t('help.3',' y en cuanto nuestro próximo agente se encuentre disponible te responderá de inmediato.')}
          <br/>
          <br/>{t('help.4','Danos una descripción del problema o duda que presentas.')}
          <br/>
          <br/>{t('help.5','Te pido de favor nos escribas desde el correo electrónico que registraste en la plataforma.')}
        </p>
        <div className='d-flex flex-row align-items-center justify-content-around pt-2'>
          <a href='https://www.facebook.com/MoveMe-Fitness-107603050964291'><img src={facebookLogo} alt='Facebook'/></a>
          <a href='https://www.instagram.com/movemefitnessapp/'><img src={instagramLogo} alt='Instagram' /></a>
        </div>
      </div>
    </>
  )
}

export default withRouter(Ayuda)
