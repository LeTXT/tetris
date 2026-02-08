export class UiRenderer {
    constructor(canvasId = 'canvas') {
        this.canvas = document.getElementById(canvasId)
        this.ctx = this.canvas ? this.canvas.getContext('2d') : null

        // Tamanho da célula na prévia (preview)
        this.PREVIEW_CELL = 14
    }

    renderNext(pieceManager) {
        // Preview da próxima peça (atualmente desativado)
        if (!this.ctx) return

        const shape = pieceManager.getNextPieceMatrix()

        if (!shape) return

        const offsetX = 120
        const offsetY = 10

        for (let row = 0; row < shape.length; row++) {
            for (let col = 0; col < shape[row].length; col++) {
                const cell = shape[row][col]

                if (cell === 0) continue

                // Para reativar, desenhe os blocos aqui
                // exemplo: this.ctx.fillRect(...)
            }
        }
    }

    renderUi(scoreManager) {
        // UI simples (textos). Atualmente sem textos ativos.
        if (!this.ctx) return

        this.ctx.fillStyle = "#000"
        this.ctx.font = "14px monospace"
        this.ctx.textAlign = "left"
        this.ctx.textBaseline = "top"

        // exemplo:
        // this.ctx.fillText(`SCORE: ${scoreManager.score}`, 10, 10)
    }
}
