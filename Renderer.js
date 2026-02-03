import { PALETTE } from "./palette.js"


export class Renderer {
    constructor() {
        this.canvas = document.getElementById('canvas')
        this.ctx = this.canvas.getContext('2d')

        this.CELL_SIZE = 24

        this.BOARD_WIDTH = 10 * this.CELL_SIZE
        this.BOARD_HEIGHT = 20 * this.CELL_SIZE

        this.UI_HEIGHT = 70

        this.canvas.width = this.BOARD_WIDTH
        this.canvas.height = this.BOARD_HEIGHT + this.UI_HEIGHT

        this.PREVIEW_CELL = 14

        this.img = new Image()
        this.img.src = './block.png'

        this.palette = PALETTE
    }

    #border() {
        this.ctx.save()

        this.ctx.strokeRect(
            0,
            this.UI_HEIGHT,
            this.BOARD_WIDTH,
            this.BOARD_HEIGHT
        )
    }

    #drawClearingCell(col, row) {
        this.ctx.fillStyle = "#fff"
        this.ctx.fillRect(
            col * this.CELL_SIZE,
            this.UI_HEIGHT + row * this.CELL_SIZE,
            this.CELL_SIZE,
            this.CELL_SIZE
        )
    }

    #drawGrid(grid, clearingLines) {
        for (let row = 0; row < grid.length; row++) {
            const isClearing = clearingLines.includes(row)

            for (let col = 0; col < grid[row].length; col++) {
                const cell = grid[row][col]
                if (cell === 0) continue

                if (isClearing) {
                    this.#drawClearingCell(col, row)
                } else {
                    // Draw the full image scaled to the cell size
                    const SPRITE_SIZE = 81

                    const spriteX = (cell - 1) * SPRITE_SIZE
                    const spriteY = 0

                    this.ctx.drawImage(
                        this.img,
                        spriteX,
                        spriteY,
                        SPRITE_SIZE,
                        SPRITE_SIZE,
                        col * this.CELL_SIZE,
                        this.UI_HEIGHT + row * this.CELL_SIZE,
                        this.CELL_SIZE,
                        this.CELL_SIZE
                    )
                }
            }
        }
    }

    #drawGridPiece(element) {
        for (let row = 0; row < element?.length; row++) {
            for (let col = 0; col < element[row].length; col++) {
                const cell = element[row][col]
                if (cell > 0) {
                    // this.ctx.fillStyle = this.palette[cell]
                    // this.ctx.fillRect(
                    //     col * this.CELL_SIZE,
                    //     this.UI_HEIGHT + row * this.CELL_SIZE,
                    //     this.CELL_SIZE,
                    //     this.CELL_SIZE
                    // )
                    const SPRITE_SIZE = 81

                    const spriteX = (cell - 1) * SPRITE_SIZE
                    const spriteY = 0

                    this.ctx.drawImage(
                        this.img,
                        spriteX,
                        spriteY,
                        SPRITE_SIZE,
                        SPRITE_SIZE,
                        col * this.CELL_SIZE,
                        this.UI_HEIGHT + row * this.CELL_SIZE,
                        this.CELL_SIZE,
                        this.CELL_SIZE
                    )
                }

            }
        }
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    }

    renderNext(pieceManager) {
        const shape = pieceManager.getNextPieceMatrix()

        if (!shape) return

        const offsetX = 120
        const offsetY = 10

        for (let row = 0; row < shape.length; row++) {
            for (let col = 0; col < shape[row].length; col++) {
                const cell = shape[row][col]

                if (cell > 0) {
                    // this.ctx.fillStyle = this.palette[cell]
                    // this.ctx.fillRect(
                    //     offsetX + col * this.PREVIEW_CELL,
                    //     offsetY + row * this.PREVIEW_CELL,
                    //     this.PREVIEW_CELL,
                    //     this.PREVIEW_CELL
                    // )
                    // this.ctx.drawImage(
                    //     this.img,
                    //     offsetX + col * this.PREVIEW_CELL,
                    //     offsetY + row * this.PREVIEW_CELL,
                    //     this.PREVIEW_CELL,
                    //     this.PREVIEW_CELL
                    // )
                    const SPRITE_SIZE = 81

                    const spriteX = (cell - 1) * SPRITE_SIZE
                    const spriteY = 0

                    this.ctx.drawImage(
                        this.img,
                        spriteX,
                        spriteY,
                        SPRITE_SIZE,
                        SPRITE_SIZE,
                        offsetX + col * this.PREVIEW_CELL,
                        offsetY + row * this.PREVIEW_CELL,
                        this.PREVIEW_CELL,
                        this.PREVIEW_CELL
                    )
                }
            }
        }
    }

    renderUi(scoreManager) {
        this.ctx.fillStyle = "#000"
        this.ctx.font = "14px monospace"
        this.ctx.textAlign = "left"
        this.ctx.textBaseline = "top"

        // let widthLevel = scoreManager.level
        // console.log(scoreManager.level.getBoundingClientRect().width)

        this.ctx.fillText(`SCORE: ${scoreManager.score}`, 10, 10)
        this.ctx.fillText(`LEVEL: ${scoreManager.level}`, 10, 28)
    }

    renderBoard(grid, clearingLines = []) {
        this.#border()

        this.#drawGrid(grid, clearingLines)
    }

    renderPiece(piece) {
        this.ctx.save()
        this.ctx.translate(piece.x * this.CELL_SIZE, piece.y * this.CELL_SIZE)
        this.#drawGridPiece(piece.shape)
        this.ctx.restore()
    }
}