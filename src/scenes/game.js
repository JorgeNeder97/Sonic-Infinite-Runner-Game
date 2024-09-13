import { k } from "../kaplayCtx";
import { makeSonic } from "../entities/sonic";
import { makeMotobug } from "../entities/motobug";
import { makeRing } from "../entities/ring";

export default function game() {
    // con setGravity() podemos indicar la gravedad que queremos aplicar al juego, recibe valores numericos
    k.setGravity(3100);

    // Guardamos el sonido de la ciudad en una constante, ya que si no lo guardamos en una constante
    // y utilizamos la propiedad loop este se escuchara en todas las escenas del juego
    const citySfx = k.play("city", { volume: 0.2, loop: true });

    // Copiamos el background
    const bgPieceWidth = 1920;
    const bgPieces = [
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

    // Creamos el Score
    let score = 0;
    let scoreMultiplier = 0;

    const scoreText = k.add([
        k.text("SCORE: 0", { font: "mania", size: 72 }),
        k.pos(20, 20),
    ]);

    // Traemos a sonic (la posición que le pasamos al vector es calculada a ojo)
    // y traemos los metodos para su logica, creados en la entidad "sonic.js"
    const sonic = makeSonic(k.vec2(200, 745));
    sonic.setControls();
    sonic.setEvents();
    // Agregamos las colisiones con onCollide(), esta función recibe como primer parametro el tag
    // del objeto con el que verificaremos si colisiona, y como segundo parametro la función que
    // se ejecutará si estos dos elementos colisionan (esta funcion tiene por defecto como parametro
    // el tag del objeto que le pasamos como primer parametro, pero debemos pasarselo como parametro
    // para poder acceder al mismo, sino no tenemos forma de llamarlo, es como el "event" en los
    // event listeners, esta por defecto pero si no lo escribimos no lo podemos acceder.
    sonic.onCollide("enemy", (enemy) => {
        if (!sonic.isGrounded()) {
            k.play("destroy", { volume: 0.1 });
            k.play("hyper-ring", { volume: 0.1 });
            k.destroy(enemy);
            // Aqui play esta usandose sobre un objeto del juego y no sobre un contexto.
            // cuando se usa sobre un objeto ejecuta una animación.
            sonic.play("jump");
            // Hacemos saltar a sonic
            sonic.jump();
            // Hacemos que al colisionar saltando contra un enemigo el multiplicador aumente en uno
            scoreMultiplier += 1;
            score += 10 * scoreMultiplier;
            scoreText.text = `SCORE: ${score}`;
            if (scoreMultiplier === 1) sonic.ringCollectUI.text = "+10";
            if (scoreMultiplier > 1)
                sonic.ringCollectUI.text = `x${scoreMultiplier}`;
            k.wait(1, () => (sonic.ringCollectUI.text = ""));
            return;
        }

        k.play("hurt", { volume: 0.2 });
        // Guardamos en el localStorage el score a través de la propiedad setData con el nombre "current-score"
        k.setData("current-score", score);
        // Le pasamos el sonido de la ciudad a la escena de gameover
        k.go("gameover", citySfx);
    });

    // Agregamos las colisiones con los anillos
    sonic.onCollide("ring", (ring) => {
        k.play("ring", { volume: 0.1 });
        k.destroy(ring);
        score++;
        // Podemos acceder y modificar el texto de un objeto de texto mediante la propiedad "text"
        scoreText.text = `SCORE: ${score}`;
        sonic.ringCollectUI.text = "+1";
        k.wait(1, () => (sonic.ringCollectUI.text = ""));
    });

    // Determinamos la velocidad inicial del juego
    let gameSpeed = 300;
    let bgSpeed = 100;

    // Spawneamos los motobugs (enemigos)
    const spawnMotoBug = () => {
        // creamos un motobug y lo ponemos en 1950 (eje x) para que no se vea al iniciar el juego
        const motobug = makeMotobug(k.vec2(1950, 773));
        // Podemos utilizar onUpdate en objetos del juego para ejecutar codigo en ciertas situaciones
        // y al destruirse el objeto del juego se detiene el onUpdate, lo cual beneficia el rendimiento
        motobug.onUpdate(() => {
            // Hacemos que al principio como el juego es lento el enemigo se mueva hacia nosotros
            // y no se quede estatico avanzando a la misma velocidad del juego
            if (gameSpeed < 3000) {
                motobug.move(-(gameSpeed + 300), 0);
                return;
            }

            // Una vez que alcanzamos los 3000 de velocidad hacemos que avance a la misma velocidad
            // que el juego para que no sea tan dificil matarlos
            motobug.move(-gameSpeed, 0);
        });

        // Gracias a que utilizamos el offscreen() tenemos acceso al metodo onExitScreen()
        // el cual ejecuta una función cuando el objeto del juego sale de la pantalla
        motobug.onExitScreen(() => {
            // motobug.pos.x nos da la ubicación del motobug en el eje x
            // con k.destroy() destruimos/eliminamos el objeto del juego
            if (motobug.pos.x < 0) k.destroy(motobug);
        });

        // Creamos un tiempo de espera para spawnear un nuevo motobug utilizando la función
        // k.rand(), la cual recibe dos parametros (un intervalo) para indicar entre que numeros
        // queremos generar un numero random, ej: k.rand(1, 5) genera un numero aleatorio
        // entre 1 y 5.
        const waitTime = k.rand(0.5, 2.5);

        // Ahora utilizamos el metodo wait() el cual recibe dos parametros, el primero es el tiempo
        // que esperará y el segundo la función que ejecutará luego de concluir ese tiempo
        k.wait(waitTime, spawnMotoBug);
    };

    spawnMotoBug();

    // Spawneamos los rings (anillos)
    const spawnRing = () => {
        const ring = makeRing(k.vec2(1950, 745));
        ring.onUpdate(() => {
            ring.move(-gameSpeed, 0);
        });
        ring.onExitScreen(() => {
            if (ring.pos.x < 0) k.destroy(ring);
        });

        const waitTime = k.rand(0.5, 3);

        k.wait(waitTime, spawnRing);
    };

    spawnRing();

    // la funcion loop() en el primer parametro recibe el tiempo en que se ejecuta (en segundos)
    // si le pasamos 1 se ejecuta cada 1 segundo.
    // y el segundo parametro es la función que se ejecutará.
    k.loop(1, () => {
        gameSpeed += 50;
        bgSpeed += 3;
    });

    //Agregamos la plataforma sobre la que corre sonic, ya que si queremos que el juego tenga
    //fisicas sonic debe estar parado sobre un objeto (el sprite es simplemente grafico)
    k.add([
        // Creamos un rectangulo (nuestra plataforma, el alto esta calculado a ojo)
        k.rect(1920, 300),

        // Le damos opacity 0 para que sea invisible
        k.opacity(0),

        // Utilizamos area para que tenga un area de colision
        k.area(),

        // Le damos una posicion en el canvas (el valor pasado esta calculado a ojo)
        k.pos(0, 832),

        // Utilizamos body() para que sea afectado por la gravedad, aunque en este caso
        // a bodi le pasaremos un objeto con la propiedad isStatic: true para indicarle
        // que es un objeto no afectado por la gravedad (un suelo o un muro o un obstaculo estatico)
        k.body({ isStatic: true }),
    ]);

    // Copiamos la logica del background
    k.onUpdate(() => {
        // Verificamos si sonic esta en el suelo para resetear el scoreMultiplier a 0
        if (sonic.isGrounded()) scoreMultiplier = 0;

        if (bgPieces[1].pos.x < 0) {
            // moveTo es una funcion que nos permite mover un objeto a una posición
            // recibe parametros en (eje x, eje y)
            bgPieces[0].moveTo(bgPieces[1].pos.x + bgPieceWidth * 2, 0);
            bgPieces.push(bgPieces.shift());
        }

        // la funcion move() nos permite mover un objeto a una velocidad x y una velocidad y
        // move(velocidadX, velocidadY)
        // Cambiamos el primer parametro de move() por la velocidad del fondo (bgSpeed)
        bgPieces[0].move(-bgSpeed, 0);
        bgPieces[1].moveTo(bgPieces[0].pos.x + bgPieceWidth * 2, 0);

        if (platforms[1].pos.x < 0) {
            platforms[0].moveTo(platforms[1].pos.x + platformWidth * 2, 450);
            platforms.push(platforms.shift());
        }

        // Aqui cambiamos el primer parametro de move() por la velocidad del juego (gameSpeed)
        platforms[0].move(-gameSpeed, 0);
        platforms[1].moveTo(platforms[0].pos.x + platformWidth * 2, 450);
    });
}
