import React from 'react'

function WelcomeCoachMail(name, uid) {
  const welcome =
     "<h1>¡Bienvenido(a) a MoveMe "+ name+"!</h1>"
    +  "<h3>La comunidad fitness que impulsará tu negocio digital.</h3>"
    +  "<p>Con tu perfil de MoveMe se crea tu página web, desde la cual podrás:</p>"
    +  "<ul>"
    +    "<li>Subir y rentar los videos de tus clases o rutinas.</li>"
    +    "<li>Agendar clases por Zoom y cobrar por ingresar a las videollamadas.</li>"
    +    "<li>Generar un paquete (Fitness Kit), el cuál incluya todas tus clases por Zoom y videos por un mes.</li>"
    +  "</ul>"
    +  "<p>Tus clientes pagarán desde MoveMe y nosotros depositaremos tus ganancias cada inicio de mes.</p>"
    +  "<p>La misión de MoveMe es impusarte a ti coach. Brindarte todas las herramientas para que compitas en el emergente mercado del <i>digital fitness</i>. Queremos que tengas tu propio negocio, que ya no dependas de nadie.</p>"
    +  "<p>Vende y administra tu gimnasio digital de manera gratis durante tus primeros 2 meses. Luego, tomaremos una contribución del 15% sobre tus ventas para que nos ayudes a impulsar este proyecto.</p>"
    +  "<p>Este es link de tu página web <a href="+' "https://moveme.fitness/coach-'+name.replace(/ /g,'-')+'/'+uid+'">'+'https://moveme.fitness/coach-'+name.replace(/ /g,'-')+'/'+uid+"</a> .Compártelo para vender tus servicios.</p>"
    +  "<a href="+' "https://youtu.be/5Nssuh8Tf0s" '+">¡Descubre cómo empezar!</a>"
    +  "<p>Síguenos en Instagram como <a href="+' "https://www.instagram.com/movemefitnessapp/" '+">movemefitnessapp</a> y en Facebook como <a href="+' "https://www.facebook.com/MoveMe-Fitness-107603050964291/" '+">movemeFitnessMX</a>.</p>"

  return welcome
}

export default WelcomeCoachMail
