import React from 'react'

function SalesCoachMail(type, data, expire, customer, price) {
  var welcome = ''

  if (type.includes('Reto')) {
   welcome = "<h3>"+customer+" ahora es tu cliente</h3>"
      +  "<p>Adquirió tu Fitness Kit por $"+price+' más IVA.</p>'
      +  "<p>Disponible hasta "+expire.substring(0,expire.indexOf("T"))+"</p>"
      +  "Entra a <a href="+' "https://moveme.fitness/sales" '+">MoveMe</a> para ver todas tus ventas."
      +  "<p>Para soporte escríbenos a ayuda@moveme.fitness</p>"
  }

  if (type.includes('Video')) {
   welcome = "<h3>"+customer+" ahora es tu cliente</h3>"
      +  "<p>Adquirió tu "+type+' '+data.claseData.title+' por $'+price+' más IVA.</p>'
      +  "<p>Disponible hasta "+expire.substring(0,expire.indexOf("T"))+"</p>"
      +  "Entra a <a href="+' "https://moveme.fitness/sales" '+">MoveMe</a> para ver todas tus ventas."
      +  "<p>Para soporte escríbenos a ayuda@moveme.fitness</p>"
  }

  if (type.includes('Zoom')) {
    welcome = "<h3>"+customer+" ahora es tu cliente</h3>"
      +  "<p>Adquirió tu "+type+' '+data.claseData.title+' por $'+price+' más IVA.</p>'
      +  "<p>Disponible "+data.startTime.time+"</p>"
      +  "Entra a <a href="+' "https://moveme.fitness/sales" '+">MoveMe</a> para ver todas tus ventas."
      +  "<p>Para soporte escríbenos a ayuda@moveme.fitness</p>"
  }


  return welcome
}

export default SalesCoachMail
