class Game {
	public static canvasWidth = 1280
	public static canvasHeigth = 768

	private static instance: Game
	public static PIXI: any

	private background = new PIXI.Sprite()
	private character: Character
	private arrows: Array<Arrow>

	// Singleton
	public static getInstance() {
		if (!Game.instance) {
			Game.instance = new Game()
		}
		return Game.instance
	}

	private constructor() {
		Game.PIXI = new PIXI.Application({ width: Game.canvasWidth, height: Game.canvasHeigth })
		document.body.appendChild(Game.PIXI.view)

		//For full screen
		// Game.PIXI.renderer.view.style.position = "absolute";
		// Game.PIXI.renderer.view.style.display = "block";
		// Game.PIXI.renderer.autoResize = true;
		// Game.PIXI.renderer.resize(window.innerWidth, window.innerHeight);

		this.character = new Character()
		this.arrows = new Array<Arrow>()

		Game.PIXI.loader
			.add([
				"./images/bg.png",
				"./images/archer.png",
				"./images/Arrow.png"
			])
			.load(() => this.setup())
	}

	private setup(): void {
		this.background.texture = Game.PIXI.loader.resources["./images/bg.png"].texture
		Game.PIXI.stage.addChild(this.background)

		this.character.initTexture(Game.PIXI.stage)

		//Gameloop
		Game.PIXI.ticker.add(() => this.gameLoop());
	}

	private gameLoop(): void {
		this.character.update()

		for (let a of this.arrows) {
			a.update()
		}

		Game.PIXI.renderer.render(Game.PIXI.stage)
	}

	public addArrow(a: Arrow): void {
		this.arrows.push(a)
		a.initTexture(Game.PIXI.stage)
	}

}

window.addEventListener("load", () => {
	Game.getInstance()
})