class Game {
	private static game_instance: Game
	private PIXI: PIXI.Application
	private bump: any = new Bump(PIXI)

	private tiledMap: any
	private platforms: Array<PIXI.extras.AnimatedSprite> = []
	private character: Character
	private arrows: Array<Arrow>

	public canvasWidth = 1280
	public canvasHeigth = 768

	// Singleton
	public static instance() {
		if (!Game.game_instance) {
			Game.game_instance = new Game()
		}
		return Game.game_instance
	}

	private constructor() {
		//Initialize PIXI
		this.PIXI = new PIXI.Application({ width: this.canvasWidth, height: this.canvasHeigth })
		this.PIXI.stage.interactive = true
		document.body.appendChild(this.PIXI.view)

		//Add tiledMap to the stage
		this.tiledMap = new PIXI.Container()
		this.PIXI.stage.addChild(this.tiledMap)

		//Load assets
		PIXI.loader
			.add([
				"./assets/tileMaps/map_x64.tmx",
				// "./assets/tilesheet.json",
				// "./assets/images/bg.png",
				"./assets/images/archer.png",
				"./assets/images/Arrow.png"
			])
			.load(() => this.setup())
	}

	private setup(): void {
		// this.level = new Level(this.app.stage)
		this.character = new Character()
		this.arrows = new Array<Arrow>()
		this.tiledMap.addChild(new PIXI.extras.TiledMap("./assets/tileMaps/map_x64.tmx"))

		//Fill platform array with tiles from tiledMap.
		for (let t of this.tiledMap.children[0].children[2].children) {
			this.platforms.push(t)
		}

		//TODO: Trying to fix texture bleeding
		for (let p of this.platforms) {
			p.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST
		}

		//Gameloop (PIXI version)
		this.PIXI.ticker.add(() => this.gameLoop())
	}

	private gameLoop(): void {
		//Update character
		this.character.update()

		//Check collision
		this.checkCharacterVsPlatforms()
		
		//Update arrows
		for (let a of this.arrows) {
			a.update()
		}

		//Render the stage
		this.PIXI.renderer.render(this.PIXI.stage)
	}

	//Add an arrow
	public addArrow(a: Arrow): void {
		this.arrows.push(a)
	}

	private checkCharacterVsPlatforms() {
		let characterVsPlatforms
		for (let p of this.platforms) {
			// let collision = Game.instance().getBump().hit(p, character, true, true, true)
			characterVsPlatforms = this.bump.hit(
				this.character.getColliderSprite(),
				p,
				true, true, true,
				(collision: any, platform: any) => {
					//`collision` tells you the side on player that the collision occurred on.
					//`platform` is the sprite from the `world.platforms` array
					//that the player is colliding with
					this.character.handleCollision(collision, platform)
				}
			)
		}
	}

	//Get instance of PIXI
	public getPIXI(): PIXI.Application {
		return this.PIXI
	}
	
	public getBump(): any {
		return this.bump
	}

	public getPlatforms(): Array<PIXI.extras.AnimatedSprite> {
		return this.platforms
	}
}

window.addEventListener("load", () => {
	Game.instance()
})