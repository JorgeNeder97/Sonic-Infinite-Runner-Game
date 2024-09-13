import { k } from "../kaplayCtx";

export function makeSonic(pos) {
    const sonic = k.add([
        // le podemos pasar un segundo parametro como objeto que contiene la animación por defecto
        // que hará el personaje
        // sprite del personaje
        k.sprite("sonic", { anim: "run" }),

        // tamaño
        k.scale(4),

        // area de colision
        k.area(),

        // cambiamos el origen donde se ubica el personaje con la función anchor()
        // la cual recibe un string (ver documentación)
        k.anchor("center"),

        // posición
        k.pos(pos),

        // Utilizamos el body() y le pasamos la fuerza con la que saltará nuestro objeto del juego
        k.body({ jumpForce: 1700 }),

        // En kaplay al utilizar add para agregar un objeto del juego podemos pasarle un objeto con
        // propiedades extra que quieras agregarle al objeto.
        // Podemos tambien pasarle metodos para nuestro objeto del juego.
        // Los nombres de los metodos los elegimos nosotros claramente.
        {
            // Creamos una propiedad personalizada para guardar un child del objeto del juego, en este
            // caso sonic, y el child seria el score que se muestra a su lado cuando juntamos un anillo
            ringCollectUI: null,


            // En este caso no utilizamos funciones flecha porque las funciones flecha tienen acceso
            // al contexto de la función padre, y si te fijas bien, la función padre aqui no tiene
            // a sonic en su contexto, por lo tanto no funcionarán los metodos que utilizamos, es
            // por esta razon que utilizamos una función comun (es un shorthand la forma en la que 
            // se declaran las funciones abajo pero son funciones comunes)
            setControls() {
                k.onButtonPress("jump", () => {
                    // Aqui podemos utilizar "this" para referirnos al objeto del juego (en este caso sonic)
                    // isGrounded() es un metodo disponible cuando utilizamos body() y verifica que el objeto del juego este sobre la plataforma si hubiere una
                    if (this.isGrounded()) {
                        // El uso de sprite() nos da acceso al metodo play() que especifica
                        // que animación se debe ejecutar.
                        // this.play() es distinto de k.play() ya que el primero se ejecuta sobre el objeto del juego
                        // y el segundo se utiliza para reproducir un sonido y es aplicado al contexto de kaplay el cual
                        // guardamos en la variable "k".
                        this.play("jump");
                        // jump() es un metodo disponible cuando utilizamos body() y hace que el objeto del juego salte fisicamente
                        // recibe la fuerza con la que saltará el objeto del juego, pero en este caso se la pasamos arriba en el body()
                        this.jump();
                        // Ejecutamos el sonido del salto
                        // el primer parametro que recibe play() es el nombre con el que cargamos el sonido en nuestro contexto
                        // el segundo parametro recibe un objeto en el cual le podemos indicar el volumen del mismo a través de la propiedad volume.
                        k.play("jump", { volume: 0.1 });
                    }
                });
            },
            setEvents() {
                // La funcion onGround() registra un evento que se ejecuta cuando el objeto del juego esta en el suelo
                this.onGround(() => {
                    // Cuando sonic toca el suelo cambiamos la animación por la de correr ("run")
                    this.play("run");
                });
            },
            // Una vez creados los metodos podemos ir al scene del juego ("game") y ejecutarlos para que 
            // comiencen a funcionar (recuerda que las teclas estan definidas en el contexto, como la 
            // tecla de "jump", la cual en el contexto definimos que es "space", "click" o "touch").
        },
    ]);

    // Agregamos el child del score que va al lado de sonic a la propiedad que definimos arriba
    // esto es para poder accederlo a través de la propiedad y no tener que escribir mas codigo.
    // De esta forma con sonic.add podemos agregar un child al objeto del juego.
    sonic.ringCollectUI = sonic.add([
        k.text("", { font: "mania", size: 24 }),
        k.color(255, 255, 0),
        k.anchor("center"),
        k.pos(30, -10),
    ]);
    // en este caso no le pusimos un texto porque se lo setearemos en la scene "game"

    // Una vez creado todo y para que podamos utilizar los metodos debemos retornar nuestro objeto del juego.
    return sonic;
}
