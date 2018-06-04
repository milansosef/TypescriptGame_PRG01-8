class Game {
	public canvasWidth = 1280
	public canvasHeigth = 768

	private static instance: Game
	private PIXI: PIXI.Application

	private background = new PIXI.Sprite()
	private level: Level
	private character: Character
	private arrows: Array<Arrow>

	// Singleton
	public static getInstance() {
		if (!Game.instance) {
			Game.instance = new Game()
		}
		return Game.instance
	}

	//Get PIXI
	public getPIXI(): PIXI.Application {
		return this.PIXI
	}

	private constructor() {
		this.PIXI = new PIXI.Application({ width: this.canvasWidth, height: this.canvasHeigth })
		document.body.appendChild(this.PIXI.view)

		this.PIXI.loader
			.add([
				"./images/tilesheet.json",
				"./images/bg.png",
				"./images/archer.png",
				"./images/Arrow.png"
			])
			.load(() => this.setup())
	}

	private setup(): void {
		this.background.texture = this.PIXI.loader.resources["./images/bg.png"].texture
		this.background.width = this.canvasWidth
		this.background.height = this.canvasHeigth
		this.PIXI.stage.addChild(this.background)

		this.level = new Level(this.PIXI.stage)
		this.character = new Character()
		this.arrows = new Array<Arrow>()

		//Gameloop
		this.PIXI.ticker.add(() => this.gameLoop())
	}

	private gameLoop(): void {
		this.character.update()

		for (let a of this.arrows) {
			a.update()
		}

		this.PIXI.renderer.render(this.PIXI.stage)
	}

	public addArrow(a: Arrow): void {
		this.arrows.push(a)
		// a.initTexture(this.PIXI.stage)
	}
}

window.addEventListener("load", () => {
	Game.getInstance()
})