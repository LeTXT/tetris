export class Board {
    constructor(rows, cols) {
        this.rows = rows
        this.cols = cols

        this.grid = this.createEmptyGrid()
    }

    createEmptyGrid() {
        return Array.from({ length: this.rows }, () =>
            Array(this.cols).fill(0)
        )
    }

    setCell(row, col, value) {
        // local onde todos os blocos irão ficar
        this.grid[row][col] = value

    }

    clearFullLines() {
        const fullRows = []

        for (let y = 0; y < this.grid.length; y++) {
            if (this.grid[y].every(n => n > 0)) {
                fullRows.push(y)
            }
        }

        if (fullRows.length === 0) return []

        return fullRows
    }

    removeLines(lines) {
        for (const y of lines) {
            this.grid.splice(y, 1)
            this.grid.unshift(new Array(10).fill(0))
        }
    }

    reset() {
        this.grid = this.createEmptyGrid()
    }

    merge(piece) {
        const shape = piece.shape

        for (let row = 0; row < shape.length; row++) {
            for (let col = 0; col < shape[row].length; col++) {
                if (shape[row][col] === 0) continue

                const y = row + piece.y
                const x = col + piece.x

                if (y < 0) continue
                if (y >= this.rows) continue
                if (x < 0 || x >= this.cols) continue

                this.setCell(y, x, shape[row][col])
            }
        }
    }

    collides(piece) {
        const shape = piece.shape

        for (let row = 0; row < shape.length; row++) {
            for (let col = 0; col < shape[row].length; col++) {
                if (shape[row][col] === 0) continue

                const x = piece.x + col
                const y = piece.y + row

                if (x < 0 || x >= this.cols) return true
                if (y >= this.rows) return true

                if (y < 0) continue

                if (this.grid[y][x] !== 0) return true
            }
        }

        return false
    }

}