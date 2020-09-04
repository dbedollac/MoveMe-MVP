import React from 'react'
import { useTranslation } from 'react-i18next';

function AvisoPrivacidad0(props) {
  const { t } = useTranslation();

  return(
    <>
    <p>Aviso de Privacidad {props.instructor!==undefined?props.instructor?'Instructor':'Usuario':null}</p>
    <p>{t('welcome', 'Hola')}</p>
    </>
  )
}

export default AvisoPrivacidad0
