import { PALETTE } from "./palette.js"

export class Renderer {
    constructor() {
        // Canvas principal e contexto 2D
        this.canvas = document.getElementById('canvas')
        this.ctx = this.canvas.getContext('2d')

        // Altura reservada para UI no topo (0 = sem UI)
        this.UI_HEIGHT = 0

        // Tamanho de cada célula do tabuleiro (em px)
        this.updateSizes()

        this.styleGame = 'normal'
        // this.styleGame = 'normal' | 'retro'

        this.BOARD_WIDTH = 10 * this.CELL_SIZE
        this.BOARD_HEIGHT = 20 * this.CELL_SIZE

        // Ajusta o tamanho real do canvas
        this.canvas.width = this.BOARD_WIDTH
        this.canvas.height = this.BOARD_HEIGHT + this.UI_HEIGHT

        this.palette = PALETTE

        // Sprite retro
        this.retroBlock = new Image()
        this.retroBlock.src = "./image/retro-block.png"

        // Atualiza tamanhos quando o viewport muda (ex.: rotação no celular)
        window.addEventListener('resize', () => this.updateSizes())
    }

    updateSizes() {
        // Usa o viewport real (mobile-friendly) e limita pelo menor entre altura e largura
        const viewportH = window.visualViewport?.height ?? window.innerHeight ?? document.documentElement.clientHeight
        const viewportW = window.visualViewport?.width ?? window.innerWidth ?? document.documentElement.clientWidth

        const joystick = document.getElementById('joystick')
        const joystickH = joystick ? joystick.getBoundingClientRect().height : 0

        const availableH = Math.max(0, viewportH - joystickH - 15)
        const cellByH = availableH / 20
        const cellByW = viewportW / 10

        this.CELL_SIZE = Math.max(10, Math.floor(Math.min(cellByH, cellByW)))
        this.BOARD_WIDTH = 10 * this.CELL_SIZE
        this.BOARD_HEIGHT = 20 * this.CELL_SIZE

        if (this.canvas) {
            this.canvas.width = this.BOARD_WIDTH
            this.canvas.height = this.BOARD_HEIGHT + this.UI_HEIGHT
        }
    }

    #border() {
        // Desenha a borda do tabuleiro com sombra
        this.ctx.save()

        if (this.styleGame === 'normal') {
            this.ctx.shadowColor = '#2B14AA'
            this.ctx.shadowBlur = 3
            this.ctx.shadowOffsetX = 0
            this.ctx.shadowOffsetY = 0

            this.ctx.strokeStyle = "#2B14AA"
        } else if (this.styleGame === 'retro') {
            this.ctx.strokeStyle = "#939881"
        }

        this.ctx.lineWidth = 2

        this.ctx.strokeRect(
            0,
            this.UI_HEIGHT,
            this.BOARD_WIDTH,
            this.BOARD_HEIGHT
        )

        this.ctx.restore()
    }

    #drawClearingCell(col, row) {
        // Célula em branco usada durante animação de limpeza
        this.ctx.fillStyle = "#fff"
        this.ctx.fillRect(
            col * this.CELL_SIZE,
            this.UI_HEIGHT + row * this.CELL_SIZE,
            this.CELL_SIZE,
            this.CELL_SIZE
        )
    }

    #drawSpriteCell(cell, x, y, size, color, local) {
        if (this.styleGame === 'retro' && this.retroBlock?.complete) {
            this.ctx.shadowBlur = 0
            this.ctx.shadowOffsetX = 0
            this.ctx.shadowOffsetY = 0
            this.ctx.drawImage(this.retroBlock, x + 1, y + 1, size - 2, size - 2)
            return
        }

        this.ctx.shadowColor = color
        local === "piece" ? this.ctx.shadowBlur = 4 : this.ctx.shadowBlur = 1
        this.ctx.shadowOffsetX = 0
        this.ctx.shadowOffsetY = 0

        this.ctx.fillStyle = color
        this.ctx.fillRect(x + 2, y + 2, size - 4, size - 4)
    }

    #drawGrid(grid, clearingLines = []) {
        // Desenha o tabuleiro inteiro
        for (let row = 0; row < grid.length; row++) {
            const isClearing = clearingLines.includes(row)

            for (let col = 0; col < grid[row].length; col++) {
                const cell = grid[row][col]
                if (cell === 0) continue

                if (isClearing) {
                    this.#drawClearingCell(col, row)
                } else {
                    const x = col * this.CELL_SIZE
                    const y = row * this.CELL_SIZE

                    const color = this.palette[cell]
                    this.#drawSpriteCell(cell, x, y, this.CELL_SIZE, color, "grid")
                }
            }
        }
    }

    #drawGridPiece(shape) {
        // Desenha uma peça (matriz pequena) usando as mesmas regras do grid
        for (let row = 0; row < shape?.length; row++) {
            for (let col = 0; col < shape[row].length; col++) {
                const cell = shape[row][col]
                if (cell === 0) continue

                const x = col * this.CELL_SIZE
                const y = row * this.CELL_SIZE

                const color = this.palette[cell]
                this.#drawSpriteCell(cell, x, y, this.CELL_SIZE, color, "piece")
            }
        }
    }

    #drawLinesOnTheGrid(grid) {
        if (this.styleGame === 'normal') {
            this.ctx.shadowColor = '#2B14AA'
            this.ctx.shadowBlur = 3
            this.ctx.shadowOffsetX = 0
            this.ctx.shadowOffsetY = 0


            this.ctx.strokeStyle = "#2B14AA"
        } else if (this.styleGame === 'retro') {
            this.ctx.fillStyle = '#C4D0A2'
            this.ctx.strokeStyle = "#939881"
        }

        this.ctx.lineWidth = 1

        for (let row = 0; row < grid?.length; row++) {
            for (let col = 0; col < grid[row].length; col++) {
                const cell = grid[row][col]

                const x = col * this.CELL_SIZE
                const y = row * this.CELL_SIZE

                this.ctx.strokeRect(x, y, this.CELL_SIZE, this.CELL_SIZE)
                if (this.styleGame === 'retro') {
                    this.ctx.fillRect(x, y, this.CELL_SIZE, this.CELL_SIZE)
                }
            }
        }
    }

    clear() {
        // Limpa o canvas inteiro
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    }

    renderBoard(grid, clearingLines = []) {
        // Desenha borda + grid do tabuleiro
        this.#border()
        this.#drawLinesOnTheGrid(grid)

        this.#drawGrid(grid, clearingLines)
    }

    renderPiece(piece) {
        // Desenha a peça atual em movimento
        this.ctx.save()
        this.ctx.translate(piece.x * this.CELL_SIZE, piece.y * this.CELL_SIZE)
        this.#drawGridPiece(piece.shape)
        this.ctx.restore()
    }
}
