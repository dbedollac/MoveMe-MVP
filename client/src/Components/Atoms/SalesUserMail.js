import React from 'react'

function SalesUserMail(type, data, expire) {
  var welcome = ''

  if (type.includes('Reto')) {
   welcome = "<h3>Gracias por comprar en MoveMe e invertir en tu coach "+data.instructor.profileName+"</h3>"
      +  "<p>Adquiriste su Fitness Kit.</p>"
      +  "<p>Disponible hasta "+expire.substring(0,expire.indexOf("T"))+"</p>"
      +  "Entra a <a href="+' "https://moveme.fitness/market" '+">MoveMe</a> para ver tus videos y tomar tus clases en vivo."
      +  "<p>Para soporte escríbenos a ayuda@moveme.fitness</p>"
  }

  if (type.includes('Video')) {
   welcome = "<h3>Gracias por comprar en MoveMe e invertir en tu coach "+data.instructor.profileName+"</h3>"
      +  "<p>Adquiriste su "+type+' '+data.claseData.title+".</p>"
      +  "<p>Disponible hasta "+expire.substring(0,expire.indexOf("T"))+"</p>"
      +  "Haz click <a href="+' "https://moveme.fitness/myVideos" '+">aquí</a> para ver tu clase."
      +  "<p>Para soporte escríbenos a ayuda@moveme.fitness</p>"
  }

  if (type.includes('Zoom')) {
   welcome = "<h3>Gracias por comprar en MoveMe e invertir en tu coach "+data.instructor.profileName+"</h3>"
      +  "<p>Adquiriste su "+type+' '+data.claseData.title+".</p>"
      +  "<p>Disponible "+data.startTime.time+"</p>"
      +  "Haz click <a href="+'"'+data.joinURL+'"'+">aquí</a> para unirte o entra a <a href="+' "https://moveme.fitness/ZoomClasses" '+">MoveMe</a>."
      +  "<p>Para soporte escríbenos a ayuda@moveme.fitness</p>"
  }


  return welcome
}

export default SalesUserMail
