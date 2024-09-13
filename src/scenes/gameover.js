import { k } from '../kaplayCtx';

export default function gameover(citySfx) {
    // Pausamos el sonido de la ciudad utilizando la propiedad paused de citySfx
    citySfx.paused = true;
    // Guardamos en una variable el best-score el cual creamos en el mainMenu al principio.
    let bestScore = k.getData("best-score");
    // Guardamos en una variable el current-score el cual creamos al morir en el "game" scene
    const currentScore = k.getData("current-score");

    // Guardamos en arrays el ranking de Grados y el score que le corresponde a cada grado
    const rankGrades = ["F", "E", "D", "C", "B", "A", "S"];
    const rankValues = [50, 80, 100, 200, 300, 400, 500];

    // Seteamos por defecto el currentRank en "F" y el bestRank en "F"
    let currentRank = "F";
    let bestRank = "F";

    // Recorremos el array de values
    for(let i = 0; i < rankValues.length; i++) {
        // Si el valor del array de valores en la posición i es menor que nuestro puntaje...
        if(rankValues[i] < currentScore) {
            // Seteamos nuestro ranking en rankGrades[i] el cual corresponde a ese valor al cual nuestro puntaje es mayor
            currentRank = rankGrades[i];
        }

        // Si el valor del array de valores en la posición i es menor que el bestScore ...
        if(rankValues[i] < bestScore) {
            // Seteamos el bestRank en rankGrades[i] donde i es la posición que corresponde al valor del cual es mayor el bestScore
            bestRank = rankGrades[i];
        }
    }

    // Verificamos si nuestro puntaje es mayor que el bestScore...
    if(bestScore < currentScore) {
        // Si es así seteamos nuestro puntaje como el nuevo best-score
        // (Este best-score es el que se guarda en localStorage)
        k.setData("best-score", currentScore);
        // Seteamos el bestScore con nuestro puntaje
        bestScore = currentScore;
        // Seteamos el bestRank con nuestro puntaje
        bestRank = currentRank;
    }

    // Agregamos el texto de GAME OVER
    k.add([
        k.text("GAME OVER", { font: "mania", size: 96 }),
        k.anchor("center"),
        // Utilizamos k.center().x para centrarlo en el eje x y k.center().y para centrarlo en el eje y y le restamos 300 para subirlo
        k.pos(k.center().x, k.center().y -300),
    ]);

    // Agregamos el texto de BEST SCORE
    k.add([
        k.text(`BEST SCORE: ${bestScore}`, { font: "mania", size: 64 }),
        k.anchor("center"),
        k.pos(k.center().x - 400, k.center().y - 200),
    ]);

    // Agregamos el texto de CURRENT SCORE
    k.add([
        k.text(`CURRENT SCORE: ${currentScore}`, { font: "mania", size: 64 }),
        k.anchor("center"),
        k.pos(k.center().x + 400, k.center().y - 200),
    ]);

    // Creamos la caja del bestRank
    const bestRankBox = k.add([
        // Creamos un rectangulo con la propiedad rect(width, height, {options}) la propiedad
        // radius se usa para redondear las esquinas del rectangulo
        k.rect(400, 400, { radius: 4 }),
        k.color(0, 0, 0),
        k.area(),
        k.anchor("center"),
        // La propiedad outline nos permite determinar el borde y sus propiedades
        // outline(borderWidth, borderColor) el color se determina utilizando k.Color.fromArray([rgb])
        k.outline(6, k.Color.fromArray([255, 255, 255])),
        k.pos(k.center().x - 400, k.center().y + 50),
    ]);

    // Le agregamos el texto con el valor del bestRank
    bestRankBox.add([
        k.text(bestRank, { font: "mania", size: 100 }),
        k.anchor("center"),
    ]);

    // Creamos la caja del currentRank
    const currentRankBox = k.add([
        k.rect(400, 400, { radius: 4 }),
        k.color(0, 0, 0),
        k.area(),
        k.anchor("center"),
        k.outline(6, k.Color.fromArray([255, 255, 255])),
        k.pos(k.center().x + 400, k.center().y + 50),
    ]);

    // Agregamos el texto con el valor del currentRank
    currentRankBox.add([
        k.text(currentRank, { font: "mania", size: 100 }),
        k.anchor("center"),
    ]);

    // Creamos un wait para mostrar la leyenda de "Press Space/Click/Touch to Play Again"
    // y la logica para que al hacer click nos lleve al scene del juego nuevamente
    k.wait(1, () => {
        // Agregamos el texto
        k.add([
            k.text("Press Space/Click/Touch to Play Again", { font: "mania", size: 64 }),
            k.anchor("center"),
            k.pos(k.center().x, k.center().y + 350),
        ]);
        // Agregamos la logica para que al apretar uno de esos botones nos lleve al scene "game"
        k.onButtonPress("jump", () => k.go("game"));
    })

}