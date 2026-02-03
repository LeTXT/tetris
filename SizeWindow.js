export class SizeWindow {
    get width() {
        return window.innerWidth
    }

    get height() {
        return window.innerHeight
    }

    get halfHeight() {
        return window.innerHeight / 2
    }

    get halfWidth() {
        return window.innerWidth / 2
    }
}