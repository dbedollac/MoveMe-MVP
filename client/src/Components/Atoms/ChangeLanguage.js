import React from 'react'
import { useTranslation } from 'react-i18next';

function ChangeLanguage(props) {
  const { i18n } = useTranslation()


  return(
    <div>
      <i style={{color:props.color,cursor:'pointer',fontSize: props.fontSize}}>{i18n.language==='es'?'English':'Español'}</i>
    </div>
  )
}

export default ChangeLanguage
