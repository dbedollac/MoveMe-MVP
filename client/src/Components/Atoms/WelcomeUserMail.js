import React from 'react'

function WelcomeUserMail(name) {
  const welcome =
     "<h1>¡Bienvenido(a) a MoveMe "+ name+"!</h1>"
    +  "<h3>Reactiva la economía sudando</h3>"
    +  "<p>La misión de MoveMe es empoderar al coach mexicano. Queremos que compitan de manera justa en este nuevo mundo digital. Que ya no dependan de cadenas de gimnasios.</p>"
    +  "<p>Invertir en tu coach es muy fácil:</p>"
    +  "<ol>"
    +   "<li>Entra a <a href="+' "https://moveme.fitness/market" '+">MoveMe</a>.</li>"
    +   "<li>Elige cómo quieres hacer ejercicio: con un video, una clase por Zoom o el Fitness Kit del algún coach (incluye todas las clases por Zoom y videos de un coach por un mes).</li>"
    +   "<li>Paga con tu tarjeta los servicios fitness que hayas seleccionado.</li>"
    +   "<li><a href="+' "https://moveme.fitness/myVideos" '+">Aquí</a> encontrarás todos los videos que hayas rentado.</li>"
    +   "<li><a href="+' "https://moveme.fitness/ZoomClasses" '+">Aquí</a> encontrarás todas las clases en vivo que hayas adquirido.</li>"
    +  "</ol>"
    +  "Síguenos en Instagram como <a href="+' "https://www.instagram.com/movemefitnessapp/" '+">movemefitnessapp</a> y en Facebook como <a href="+' "https://www.facebook.com/MoveMe-Fitness-107603050964291/" '+">movemeFitnessMX</a>."

  return welcome
}

export default WelcomeUserMail
