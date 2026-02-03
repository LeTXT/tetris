import { Renderer } from "./Renderer.js"
import { Board } from "./Board.js"
import { Piece } from "./Piece.js"
import { Input } from "./Input.js"
import { PieceManager } from "./PieceManager.js"
import { ScoreManager } from "./ScoreManager.js"

export class Game {
    constructor() {
        this.rows = 20
        this.cols = 10

        this.state = "off"
        // this.state = "menu" | "playing" | "paused" | "gameover" | "clearing" | "off"
        this.running = false

        this.board = new Board(this.rows, this.cols)

        this.pieceManager = new PieceManager()
        this.spawnPiece()

        this.input = new Input()
        this.renderer = new Renderer()

        this.scoreManager = new ScoreManager()

        this.baseDropInterval = 500
        this.dropInterval = this.baseDropInterval // ms
        this.dropCounter = 0

        this.moveInterval = 100
        this.moveCounter = 0

        this.lastTime = 0

        this.isGrounded = false
        this.lockDelay = 500
        this.lockCounter = 0

        this.clearingLines = []
        this.clearTimer = 0
        this.clearDelay = 150

        this.loop = this.loop.bind(this) // lembrar quem é o método loop
    }

    start() {
        if (this.running) return
        this.running = true
        this.state = "playing"
        requestAnimationFrame(this.loop)
    }

    resetGame() {
        this.state = "playing"

        this.board.reset()
        this.pieceManager.reset()
        this.scoreManager.reset()

        this.baseDropInterval = 500
        this.updateSpeed()
        this.dropCounter = 0
        this.moveCounter = 0
        this.lastTime = 0

        this.spawnPiece()
    }

    loop(time) {
        // controla a peça aparecendo e desaparecendo
        const deltaTime = time - this.lastTime
        this.lastTime = time

        this.update(deltaTime)
        this.render()

        requestAnimationFrame(this.loop)
    }

    update(deltaTime) {
        if (this.state === "clearing") {
            this.clearTimer += deltaTime

            if (this.clearTimer >= this.clearDelay) {
                this.board.removeLines(this.clearingLines)

                this.scoreManager.addLines(this.clearingLines.length)
                this.updateSpeed()

                this.clearTimer = 0
                this.clearingLines = []
                this.state = "playing"
                this.spawnPiece()
            }

            return
        }

        if (this.state !== "playing") return

        this.dropCounter += deltaTime
        this.moveCounter += deltaTime

        if (this.moveCounter >= this.moveInterval) {
            this.inputHandler()
            this.moveCounter = 0
        }

        if (this.dropCounter >= this.dropInterval) {
            this.piece.move(0, 1)

            if (this.board.collides(this.piece)) {
                this.piece.move(0, -1)
            } 

            this.dropCounter = 0
        }

        // Recalcular isGrounded a cada frame
        this.piece.move(0, 1)
        this.isGrounded = this.board.collides(this.piece)
        this.piece.move(0, -1)

        this.handleLock(deltaTime)
    }

    handleLock(deltaTime) {
        if (!this.isGrounded) {
            this.lockCounter = 0
            return
        }

        this.lockCounter += deltaTime

        if (this.lockCounter < this.lockDelay) return

        // trava a peça
        this.board.merge(this.piece)

        // GAME OVER
        if (this.piece.y < 0) {
            this.gameOver()
            return
        }

        this.clearingLines = this.board.clearFullLines()

        if (this.clearingLines.length > 0) {
            this.state = "clearing"
            this.lockCounter = 0 // Reset lock counter
            return
        }

        // nenhuma linha limpa → segue o jogo
        this.lockCounter = 0
        this.isGrounded = false
        this.spawnPiece()
    }

    updateSpeed() {
        const level = this.scoreManager.level

        this.dropInterval = Math.max(
            80,
            this.baseDropInterval - (level - 1) * 40
        )
    }

    spawnPiece() {
        const typeData = this.pieceManager.nextType()
        this.piece = new Piece(typeData)
    }

    gameOver() {
        this.state = "gameover"
    }

    inputHandler() {
        if (this.input.left) {
            this.piece.move(-1, 0)
            if (this.board.collides(this.piece)){
                this.piece.move(1, 0)
            } else {
                this.lockCounter = 0 // Movimento válido reseta o lock
            }
        }
        if (this.input.right) {
            this.piece.move(1, 0)
            if (this.board.collides(this.piece)){
                this.piece.move(-1, 0)
            } else {
                this.lockCounter = 0 // Movimento válido reseta o lock
            }
        }
        if (this.input.rotatePressed) {
            this.piece.rotate()
            if (this.board.collides(this.piece)) {
                this.piece.rotateBack()
            } else {
                this.lockCounter = 0 // Rotação válida reseta o lock
            }
            this.input.rotatePressed = false
        }

        if (this.input.hardDropPressed) {
            this.hardDrop()
            this.input.hardDropPressed = false
        }

        this.moveCounter -= this.moveInterval
        if (this.input.down) {
            this.softDrop()
            if (this.board.collides(this.piece)) {
                this.piece.move(0, -1)
            } else {
                this.lockCounter = 0 // Soft drop também reseta
            }
        }
    }

    softDrop() {
        if (!this.board.collides(this.piece, this.piece.x, this.piece.y + 1)) {
            this.piece.y++
            this.scoreManager.addSoftDrop(1)
        }
    }

    hardDrop() {
        if (this.state !== "playing") return

        let dropDistance = 0

        while (true) {
            this.piece.move(0, 1)

            if (this.board.collides(this.piece)) {
                this.piece.move(0, -1)
                break
            }

            dropDistance++
        }

        this.board.merge(this.piece)

        if (this.piece.y < 0) {
            this.gameOver()
            return
        }

        this.scoreManager.addHardDrop(dropDistance)
        
        this.clearingLines = this.board.clearFullLines()

        if (this.clearingLines.length > 0) {
            this.state = "clearing"
            this.lockCounter = 0
            return
        }

        this.isGrounded = false
        this.lockCounter = 0

        this.spawnPiece()
    }

    render() {
        this.renderer.clear()
        this.renderer.renderBoard(this.board.grid, this.clearingLines)

        this.renderer.renderPiece(this.piece.getCells(), this.piece.x, this.piece.y)
        this.renderer.renderUi(this.scoreManager)
        this.renderer.renderNext(this.pieceManager)

    }
}