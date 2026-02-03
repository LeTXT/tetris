export class Input {
    constructor() {
        this.left = false
        this.right = false
        this.down = false

        this.rotate = false
        this.rotatePressed = false

        this.hardDrop = false
        this.hardDropPressed = false

        window.addEventListener('keydown', e => this.onKeyDown(e))
        window.addEventListener('keyup', e => this.onKeyUp(e))
    }

    bindHoldButton(button, action) {
        const press = (e) => {
            if (e) e.preventDefault()
            this[action] = true
        }
        const release = (e) => {
            if (e) e.preventDefault()
            this[action] = false
        }

        button.addEventListener('mousedown', press)
        button.addEventListener('mouseup', release)
        button.addEventListener('mouseleave', release)

        button.addEventListener('touchstart', press, { passive: false })
        button.addEventListener('touchend', release, { passive: false })
    }

    bindPressButton(button, pressedFlag, holdFlag = null) {
        const press = (e) => {
            if (e) e.preventDefault()
            if (holdFlag && this[holdFlag]) return // evita touchstart + mousedown duplicados
            this[pressedFlag] = true
            if (holdFlag) this[holdFlag] = true
        }

        const release = (e) => {
            if (e) e.preventDefault()
            if (holdFlag) this[holdFlag] = false
        }

        button.addEventListener('mousedown', press)
        button.addEventListener('mouseup', release)

        button.addEventListener('touchstart', press, { passive: false })
        button.addEventListener('touchend', release, { passive: false })
    }

    onKeyDown(e) {
        if (e.key === 'ArrowLeft' || e.key === 'a') this.left = true
        if (e.key === 'ArrowRight' || e.key === 'd') this.right = true
        if (e.key === 'ArrowDown' || e.key === 's') this.down = true
        if (e.code === 'Space') {
            if (!this.hardDrop) {
                this.hardDropPressed = true
            }
            this.hardDrop = true
        }

        if (e.code === 'ArrowUp' || e.key === 'w') {
            if (!this.rotate) {
                this.rotatePressed = true
            }
            this.rotate = true
        }
    }

    onKeyUp(e) {
        if (e.key === 'ArrowLeft' || e.key === 'a') this.left = false
        if (e.key === 'ArrowRight' || e.key === 'd') this.right = false
        if (e.key === 'ArrowDown' || e.key === 's') this.down = false
        if (e.code === 'Space') this.hardDrop = false

        if (e.key === 'ArrowUp' || e.key === 'w') this.rotate = false
    }
}
