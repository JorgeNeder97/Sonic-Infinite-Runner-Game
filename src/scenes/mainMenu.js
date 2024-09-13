import { makeSonic } from "../entities/sonic";
import { k } from "../kaplayCtx";
// para desarrollar podemos agregar la funcion area() a nuestros objetos para ver el area de colision
// pero por razones de rendimiento es recomendable quitarlas una vez este terminado el juego

export default function mainMenu() {
    // getData es una funcion que nos permite traer información del localStorage
    // setData es una funcion que nos permite setear información en el localStorage
    if (!k.getData("best-score")) k.setData("best-score", 0);
    // onButtonPress es un eventHandler, el primer parametro es la key
    // (las que configuramos en el contexto), el segundo parametro es una función que se ejecuta
    // al presionar esa key
    // le indicamos que al apretar la tecla de saltar ("jump") nos lleve al scene llamado "game"
    k.onButtonPress("jump", () => k.go("game"));

    // A partir de aqui trabajamos el infinite paralax del background
    const bgPieceWidth = 1920;
    const bgPieces = [
        // de esta forma creamos un objeto del juego con un sprite
        // add() sirve para crear un objeto dentro del juego, recibe un array
        // donde le podemos indicar que utilice un sprite para crear el objeto
        // con pos() le podemos indicar la posicion donde se situa el objeto (eje x, eje y)
        // con scale() le podemos indicar el tamaño (si ponemos 2 por ejemplo duplica el tamaño del sprite)
        // con opacity() determinamos la opacidad del objeto (va de 0 a 1)
        k.add([
            k.sprite("chemical-bg"),
            k.pos(0, 0),
            k.scale(2),
            k.opacity(0.8),
        ]),
        k.add([
            k.sprite("chemical-bg"),
            k.pos(bgPieceWidth * 2, 0),
            k.scale(2),
            k.opacity(0.8),
        ]),
    ];

    const platformWidth = 1280;
    const platforms = [
        k.add([k.sprite("platforms"), k.pos(0, 450), k.scale(4)]),
        k.add([
            k.sprite("platforms"),
            k.pos(platformWidth * 2, 450),
            k.scale(4),
        ]),
    ];

    // Agregamos el titulo
    k.add([
        // texto (recibe el texto y un objeto con parametros para configurar la fuente y el tamaño)
        k.text("SONIC RING RUN", {font: "mania", size: 96}),
        // k.center() nos permite ubicar un objeto en el centro del contexto de kaplay
        k.pos(k.center().x, 200),
        // como pos ubica la esquina superior izquierda en el centro del contexto
        // cambiamos el origen para que el texto este realmente centrado
        k.anchor("center"),
    ]);

    // Agregamos la descripción
    k.add([
        k.text("Press Space/Click/Touch to Play", { font: "mania", size: 32 }),
        k.anchor("center"),
        k.pos(k.center().x, k.center().y - 200),
    ]);

    // Traemos a sonic
    // vec2 es una funcion vectorial que nos permite pasar la posicion en un solo parametro (eje x, eje y)
    makeSonic(k.vec2(200, 745));

    // onUpdate() es una función que se ejecuta con cada frame que pasa por segundo
    // recibe una funcion como parametro para ejecutarla con cada frame
    k.onUpdate(() => {
        if (bgPieces[1].pos.x < 0) {
            // moveTo es una funcion que nos permite mover un objeto a una posición
            // recibe parametros en (eje x, eje y)
            bgPieces[0].moveTo(bgPieces[1].pos.x + bgPieceWidth * 2, 0);
            bgPieces.push(bgPieces.shift());
        }

        // la funcion move() nos permite mover un objeto a una velocidad x y una velocidad y
        // move(velocidadX, velocidadY)
        bgPieces[0].move(-100, 0);
        bgPieces[1].moveTo(bgPieces[0].pos.x + bgPieceWidth * 2, 0);

        if(platforms[1].pos.x < 0) {
                                                // Aqui tambien podemos utilizar plataforms[1].width que seria igual que usar plataformWidth y nos ahorramos una variable
            platforms[0].moveTo(platforms[1].pos.x + platformWidth * 2, 450);
            platforms.push(platforms.shift());
        }

        platforms[0].move(-2000, 0);
        platforms[1].moveTo(platforms[0].pos.x + platformWidth * 2, 450);
    });
}
