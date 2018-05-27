class Game {
	private static instance: Game

	public canvas: HTMLCanvasElement
	public context: CanvasRenderingContext2D
	// private background: HTMLImageElement

	private character: Character
	private arrows: Array<Arrow>

	private constructor() {
		this.canvas = <HTMLCanvasElement>document.getElementById('canvas')
		this.context = <CanvasRenderingContext2D>this.canvas.getContext("2d")

		// this.background = new Image()
		// this.background.src = './images/bg.png'

		this.character = new Character()
		this.arrows = new Array<Arrow>()

		this.gameLoop()
	}

	// Singleton
	public static getInstance() {
		if (!Game.instance) {
			Game.instance = new Game()
		}
		return Game.instance
	}

	private gameLoop(): void {
		// this.context.clearRect(0, 0, 1280, 720)
		// this.context.drawImage(this.background, 0, 0, 1280, 720);

		this.character.update()

		for (let a of this.arrows) {
			a.update()
		}

		requestAnimationFrame(() => this.gameLoop())
	}

	public addArrow(a: Arrow): void {
		this.arrows.push(a)
	}

}

window.addEventListener("load", () => {
	Game.getInstance()
})