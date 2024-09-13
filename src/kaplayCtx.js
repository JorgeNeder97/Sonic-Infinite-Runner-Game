import kaplay from "kaplay";

// Ejecuta el canvas de kaplay y dentro recibe un objeto con opciones
// Lo exportamos para usarlo en la aplicación
export const k = kaplay({
    // determinar el ancho y el alto de la pantalla
    width: 1920,
    height: 1080,

    // mantener el aspecto de ratio de la pantalla
    letterbox: true,

    // poner negro el fondo de la pantalla (recibe valores rgb en un array)
    background: [0, 0, 0],

    // indica a kaplay que no debe usarse de forma global,
    // esto es util porque puede haber variables o funciones 
    // de kaplay que tienen un nombre igual al de otras variables
    // o funciones de otros frameworks que podrías usar
    global: false,

    // sirve para que al tocar la pantalla en el celular simule un click (se adapta a mobile)
    touchToMouse: true,

    // definimos los controles
    buttons: {
        jump: {
            keyboard: ["space"],
            mouse: "left",
        }
    },

    // definimos una tecla para abrir el modo debug:
    debugKey: "d",

    // Definimos si queremos activar o no el modo debug (viene activado por defecto)
    // Se recomienda desactivarlo una vez terminado de desarrollar el juego
    debug: true,
});