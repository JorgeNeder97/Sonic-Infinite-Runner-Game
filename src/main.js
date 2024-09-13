import { k } from "./kaplayCtx";
import game from "./scenes/game";
import gameover from "./scenes/gameover";
import mainMenu from "./scenes/mainMenu";

// loadSprite se utiliza para cargar un sprite y recibe dos parametros, el nombre o key del sprite y el source
k.loadSprite("chemical-bg", "graphics/chemical-bg.png");
k.loadSprite("platforms", "graphics/platforms.png");
// tambien recibe un tercer para metro para definir las opciones de las animaciones en el caso de tener una spriteSheet u Hoja de Animaciones
k.loadSprite("sonic", "graphics/sonic.png", {
    // sliceX se usa para determinar el numero de frames en el eje x (filas) de la imagen, en este caso son 8
    sliceX: 8,
    // sliceY es lo mismo pero por columnas (eje y)
    sliceY: 2,
    // en anims es donde configuramos nuestras animaciones, es un objeto
    anims: {
        // determinamos el nombre de la animacion (si es mas de una palabra se puede definir como string)
        // y le indicamos mediante un objeto y las
        // propiedades from y to desde que frame hasta que frame va la animación
        // si tiene dos columnas es como si la columna de abajo la agregaran al ultimo en el mismo
        // array. Tambien tenemos la propiedad loop que sirve para que la animación se ejecute
        // en loop.
        // otra propiedad es speed, la cual determina la velocidad en frames por segundo a la que se
        // ejecuta la animación
        run: { from: 0, to: 7, loop: true, speed: 30 },
        jump: { from: 8, to: 15, loop: true, speed: 100 },
    },
});
k.loadSprite("ring", "graphics/ring.png", {
    sliceX: 16,
    sliceY: 1,
    anims: {
        spin: { from: 0, to: 15, loop: true, speed: 30 },
    },
});
k.loadSprite("motobug", "graphics/motobug.png", {
    sliceX: 5,
    sliceY: 1,
    anims: {
        run: { from: 0, to: 4, loop: true, speed: 8 },
    },
});

// para cargar fuentes se utiliza loadFont("nombre de referencia", "path de la funete")
k.loadFont("mania", "fonts/mania.ttf");
// para cargar sonidos se utiliza loadSound("nombre de referencia", "path del sonido")
k.loadSound("destroy", "sounds/Destroy.wav");
k.loadSound("hurt", "sounds/Hurt.wav");
k.loadSound("hyper-ring", "sounds/HyperRing.wav");
k.loadSound("jump", "sounds/Jump.wav");
k.loadSound("city", "sounds/city.mp3");
k.loadSound("ring", "sounds/Ring.wav");

// para crear una escena utilizamos la funcion scene()
// el primer parametro es el nombre de la escena
// el segundo es una funcion que se ejecuta cuando estamos en esa escena

// esta funcion mainMenu la estamos importando desde un archivo de la carpeta scenes
k.scene("main-menu", mainMenu);

// importamos la escena del juego desde el archivo game.js que creamos aparte
k.scene("game", game);

k.scene("gameover", gameover);

// utilizamos la funcion go() para ir a una escena, recibe el nombre de la escena como parametro
k.go("main-menu");