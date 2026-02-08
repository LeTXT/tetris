import { SizeWindow } from './SizeWindow.js'

export class GameUI {
    constructor(game) {
        this.game = game
        this.sizeWindow = new SizeWindow()

        this.startBtn = document.getElementById('start')
        this.restartBtn = document.getElementById('restart')
        this.pauseBtn = document.getElementById('pause')
        this.playBtn = document.getElementById('play')
        this.menu = document.getElementById('menu')

        this.joystick = document.getElementById('joystick')

        this.btnLeft = document.getElementById('left')
        this.btnRight = document.getElementById('right')
        this.btnDown = document.getElementById('down')
        this.btnRotate = document.getElementById('rotate')
        this.btnHardDrop = document.getElementById('hard-drop')
        this.scoreUI = document.getElementById('score')
        this.levelUI = document.getElementById('level')

        this.init()
    }

    init() {
        this.centralizeItem(this.startBtn)
        this.centralizeItem(this.menu)
        this.localPause(this.pauseBtn)
        this.hideAllButtons()
        this.infoGame()
        this.bindScoreUpdates()
        this.hideJoystick()
        this.bindEvents()
    }

    infoGame() {
        if (this.scoreUI) this.scoreUI.textContent = this.game.scoreManager.score
        if (this.levelUI) this.levelUI.textContent = this.game.scoreManager.level
    }

    bindScoreUpdates() {
        if (!this.game?.scoreManager) return
        this.game.scoreManager.onChange = () => this.infoGame()
    }

    bindEvents() {
        this.bindMenuEvents()
        this.bindGameEvents()
        this.bindInputEvents()
    }

    bindMenuEvents() {
        this.startBtn.addEventListener('click', () => this.startGame())
        this.restartBtn.addEventListener('click', () => this.restartGame())
    }

    bindGameEvents() {
        this.pauseBtn.addEventListener('click', () => this.pauseGame())
        this.playBtn.addEventListener('click', () => this.playGame())
    }

    bindInputEvents() {
        this.game.input.bindHoldButton(this.btnLeft, 'left')
        this.game.input.bindHoldButton(this.btnRight, 'right')
        this.game.input.bindHoldButton(this.btnDown, 'down')

        this.game.input.bindPressButton(this.btnRotate, 'rotatePressed', 'rotate')
        this.game.input.bindPressButton(this.btnHardDrop, 'hardDropPressed', 'hardDrop')
    }


    centralizeItem(item) {
        const halfW = item.clientWidth / 2
        const halfH = item.clientHeight / 2

        item.style.left = `${this.sizeWindow.halfWidth - halfW}px`
        item.style.top = `${this.sizeWindow.halfHeight - halfH}px`
    }

    localPause(item) {
        item.style.top = "50px"
        item.style.right = "60px"
    }

    hideAllButtons() {
        this.restartBtn.style.display = 'none'
        this.playBtn.style.display = 'none'
        this.pauseBtn.style.display = 'none'
    }

    hideJoystick() {
        if (this.joystick) this.joystick.style.display = 'none'
    }

    showJoystick() {
        if (this.joystick) this.joystick.style.display = 'flex'
    }

    startGame() {
        this.game.start()
        this.startBtn.style.display = 'none'
        this.pauseBtn.style.display = 'inline'
        this.showJoystick()
    }

    restartGame() {
        this.game.resetGame()
        this.updateButtons()
    }

    pauseGame() {
        if (this.game.state === 'playing') {
            this.game.state = 'paused'
            this.updateButtons()
        }
    }

    playGame() {
        this.game.state = 'playing'
        this.updateButtons()
    }

    updateButtons() {
        if (this.game.state === 'paused') {
            this.restartBtn.style.display = 'inline'
            this.playBtn.style.display = 'inline'
            this.pauseBtn.style.display = 'none'
        } else {
            this.hideAllButtons()
            this.pauseBtn.style.display = 'inline'
        }
    }
}
