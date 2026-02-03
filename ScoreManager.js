export class ScoreManager {
    constructor() {
        this.score = 0
        this.lines = 0
        this.level = 1
    }

    addLines(count) {
        const pointsTable = {
            0: 0,
            1: 100,
            2: 300,
            3: 500,
            4: 800
        }

        this.lines += count
        this.score += pointsTable[count] * this.level

        console.log(this.score, pointsTable[count], this.level)
        this.#addLevel()
        this.#updateLevel()
    }

    #addLevel() {
        this.level = Math.floor(this.lines / 10) + 1
    }

    reset() {
        this.score = 0
        this.lines = 0
        this.level = 1
    }

    addSoftDrop(cell) {
        this.score += cell * this.level
    }

    addHardDrop(cell) {
        const pointsPerCell = 2
        this.score += cell * pointsPerCell * this.level
    }

    #updateLevel() {
        this.level = Math.floor(this.lines / 10) + 1
    }
}