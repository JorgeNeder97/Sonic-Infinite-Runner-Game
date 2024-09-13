import { k } from '../kaplayCtx';

export function makeRing(pos) {
    return k.add([
        k.sprite("ring", {anim: "spin"}),
        k.scale(4),
        k.area(),
        k.anchor("center"),
        k.pos(pos),
        k.offscreen(),
        "ring",
    ]);
}