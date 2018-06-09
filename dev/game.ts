class Game {
	public canvasWidth = 1280
	public canvasHeigth = 768

	private static game_instance: Game
	private app: PIXI.Application

	private tiledMap: PIXI.Container
	private background = new PIXI.Sprite()
	private level: Level
	private character: Character
	private arrows: Array<Arrow>

	// Singleton
	public static instance() {
		if (!Game.game_instance) {
			Game.game_instance = new Game()
		}
		return Game.game_instance
	}

	//Get app
	public PIXI(): PIXI.Application {
		return this.app
	}

	private constructor() {
		this.app = new PIXI.Application({ width: this.canvasWidth, height: this.canvasHeigth })
		this.app.stage.interactive = true
		document.body.appendChild(this.app.view)

		//Add tiledMap to the stage
		this.tiledMap = new PIXI.Container()
		this.app.stage.addChild(this.tiledMap)

		PIXI.loader
			.add([
				"./assets/map_x64.tmx",
				"./assets/tilesheet.json",
				"./assets/images/bg.png",
				"./assets/images/archer.png",
				"./assets/images/Arrow.png"
			])
			.load(() => this.setup())
	}

	private setup(): void {
		// this.level = new Level(this.app.stage)
		this.character = new Character()
		this.arrows = new Array<Arrow>()
		this.tiledMap.addChild(new PIXI.extras.TiledMap("./assets/map_x64.tmx"))

		//Gameloop
		this.app.ticker.add(() => this.gameLoop())
	}

	private gameLoop(): void {
		this.character.update()

		for (let a of this.arrows) {
			a.update()
		}

		this.app.renderer.render(this.app.stage)
	}

	public addArrow(a: Arrow): void {
		this.arrows.push(a)
		// a.initTexture(this.app.stage)
	}
}

window.addEventListener("load", () => {
	Game.instance()
})