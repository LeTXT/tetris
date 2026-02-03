import { SHAPES } from "./shapes.js";

export class PieceManager {
    constructor() {
        this.arrayShapes = []

        this.bagSytem = []
    }

    nextType() {
        if (this.bagSytem.length === 0) {
            this.#generateBag()
        }
        
        const nextKey = this.bagSytem.pop()
        return SHAPES[nextKey]
    }

    getNextQueue(count = 3) {
        if (this.bagSytem.length < count) {
            this.#generateBag()
        }

        return this.bagSytem.slice(-count).reverse()
    }

    getNextPieceMatrix() {
        if (this.bagSytem.length === 0) {
            this.#generateBag()
        }

        const nextKey = this.bagSytem[this.bagSytem.length - 1]
        return SHAPES[nextKey].rotations[0]
    }

    reset() {
        this.bagSytem = []
    }

    #generateBag() {
        const keys = Object.keys(SHAPES)

        for (let i = keys.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1))
                ;[keys[i], keys[j]] = [keys[j], keys[i]]
        }

        this.bagSytem = keys
    }
}