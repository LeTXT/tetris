import { SHAPES } from "./shapes.js";

export const PALETTE = (() => {
    const palette = ['']

    Object.values(SHAPES).forEach(shapes => {
        palette[shapes.id] = shapes.color
    })

    return palette
})()