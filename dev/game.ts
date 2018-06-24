class Game {
	private static game_instance: Game
	private PIXI: PIXI.Application
	private bump: any = new Bump(PIXI)
	// private scene: Scene

	private tiledMap: any
	private platforms: Array<PIXI.extras.AnimatedSprite> = []
	private character: Character
	private targetDummy: TargetDummy
	private arrows: Array<Arrow>

	private scoreText: PIXI.Text
	private points: number = 0
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
				"./assets/images/archer.png",
				"./assets/images/Arrow.png",
				"./assets/images/dummy_1.png",
				"./assets/images/dummy_2.png",
				"./assets/images/dummy_3.png"
			])
			.load(() => this.setup())
	}

	private setup(): void {
		//Display the score on screen
		const style = new PIXI.TextStyle({
			fill: [
				"black",
				"black"
			],
			fontFamily: "Impact, Charcoal, sans-serif",
			fontSize: 28
		})
		this.scoreText = new PIXI.Text('Score: ' + this.points, style)
		this.scoreText.anchor.x = -1
		this.scoreText.anchor.y = -1
		this.PIXI.stage.addChild(this.scoreText)

		// this.level = new Level(this.app.stage)
		this.character = new Character()
		this.targetDummy = new TargetDummy()
		this.arrows = new Array<Arrow>()
		this.tiledMap.addChild(new PIXI.extras.TiledMap("./assets/tileMaps/map_x64.tmx"))

		//Fill platform array with tiles from tiledMap.
		for (let t of this.tiledMap.children[0].children[2].children) {
			this.platforms.push(t)
		}

		//TODO: Trying to fix texture bleeding
		// for (let p of this.platforms) {
		// 	p.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST
		// }

		//Gameloop (PIXI version)
		this.PIXI.ticker.add(() => this.gameLoop())
	}

	private gameLoop(): void {
		//Update character
		this.character.update()

		//Update dummy
		this.targetDummy.update()

		//Check collision
		this.checkCharacterVsPlatforms()
		this.checkDummyVsArrows()
		this.checkPlatformsVsArrows()

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

	//Remove an arrow
	public removeArrow(a: Arrow): void {
		console.log("Remove arrow")
		//TODO: Fix remove from stage
		this.character.unsubscribe(a)
		let index = this.arrows.indexOf(a)
		if (index !== -1) {
			this.arrows.splice(index, 1);
		}

	}

	private checkCharacterVsPlatforms(): void {
		let characterVsPlatforms
		for (let p of this.platforms) {
			characterVsPlatforms = this.bump.hit(
				this.character.getColliderSprite(),
				p,
				true, false, true,
				(collision: any, platform: any) => {
					//'collision' tells you the side on player that the collision occurred on.
					//`platform` is the sprite from the platforms array that the character is colliding with.
					this.character.handleCollision(collision, platform)
				}
			)
		}
	}

	private checkPlatformsVsArrows(): void {
		for (let p of this.platforms) {
			for (let a of this.arrows) {
				let platformsVsArrows = this.bump.hit(p, a.getColliderSprite(), false, true, true)
				if (platformsVsArrows) {
					a.stopMoving()
				}
			}
		}
	}

	private checkDummyVsArrows(): void {
		// let index = 0
		for (let a of this.arrows) {
			let dummyVsArrows = this.bump.hit(this.targetDummy.getColliderSprite(), a.getColliderSprite(), false, true, true)
			if (dummyVsArrows) {
				a.stopMoving()
				this.setScore()
			}
		}
	}

	private setScore(): void {
		this.targetDummy.timesHit ++
		this.points += 10
		this.scoreText.text = "Score: " + this.points
		console.log("Score: " + this.points)
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