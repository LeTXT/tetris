export class Piece {
    constructor(typeData) {
        this.type = typeData

        this.rotationIndex = 0 
        this.shape = []

        this.x = 3
        this.y = -1

        this.#updateShape()
    }

    #updateShape() {
        // forma da peça // definir a forma e a rotação
        this.shape = this.type?.rotations[this.rotationIndex]

    }

    rotate() {
        // controle de rotação
        this.rotationIndex = 
            (this.rotationIndex + 1) % this.type?.rotations.length

        this.#updateShape()
    }

    rotateBack() {
        this.rotationIndex =
            (this.rotationIndex + 3) % this.type?.rotations.length
            // talvez temporário
        this.#updateShape()
    }


    move(dx, dy) {
        this.x += dx
        this.y += dy
    }

    getCells() {
        // movimento local ??
        return {
            shape: this.shape,
            x: this.x,
            y: this.y
        }
    }
}

// peça ainda é uma forma abstrata, ela não existe no board e o board não existe para ela, quem irá definir e ligar a peça ao board é o game