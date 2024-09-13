import { k } from "../kaplayCtx";

export function makeMotobug(pos) {
    return k.add([
        k.sprite("motobug", { anim: "run" }),
        // Aqui cambiamos la forma del area del rectangulo con la propiedad shape
        // y creamos un nuevo rectangulo con new k.Rect(offset, width, height)
        k.area({ shape: new k.Rect(k.vec2(-5, 0), 32, 32) }),
        k.scale(4),
        k.anchor("center"),
        k.pos(pos),
        // offscreen() nos permite utilizar metodos para chequear que el objeto del juego salió de la pantalla
        // es necesario para poder detectar cuando el objeto del juego salio de la pantalla y asi poder 
        // spawnear otros
        k.offscreen(),
        // utilizamos el tag "enemy" para identificar el objeto del juego
        // Recuerda que los tags son strings y se utilizan para referenciar objetos del juego e identificarlos
        "enemy",
    ]);
}
