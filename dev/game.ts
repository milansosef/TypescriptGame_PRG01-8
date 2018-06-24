class Game {
	private static game_instance: Game
	private PIXI: PIXI.Application
	private bump: any = new Bump(PIXI)

	private tiledMap: any
	private platforms: Array<PIXI.extras.AnimatedSprite> = []

	private gameObjects: Array<GameObject>
	private character: Character
	private targetDummy: TargetDummy

	private scoreText: PIXI.Text
	private points: number = 0
	public canvasWidth = 1280
	public canvasHeigth = 768

	// Singleton
	public static instance(): Game {
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
				"./assets/images/arrow.png",
				"./assets/images/dummy_1.png",
				"./assets/images/dummy_2.png",
				"./assets/images/dummy_3.png"
			])
			.load(() => this.setup())
	}

	private setup(): void {
		//Display the score on screen
		this.createScoreText()

		this.character = new Character()
		this.targetDummy = new TargetDummy()

		this.gameObjects = new Array<GameObject>()
		this.gameObjects.push(this.character, this.targetDummy)

		this.tiledMap.addChild(new PIXI.extras.TiledMap("./assets/tileMaps/map_x64.tmx"))

		//Fill platform array with tiles from tiledMap.
		for (let t of this.tiledMap.children[0].children[2].children) {
			this.platforms.push(t)
		}

		//Initialize gameloop (PIXI version)
		this.PIXI.ticker.add(() => this.gameLoop())
	}

	private gameLoop(): void {
		//Update all gameObjects
		for (let o of this.gameObjects) {
			o.update()
		}

		//Check collision
		this.checkCharacterVsPlatforms()
		this.checkDummyVsArrows()
		this.checkPlatformsVsArrows()

		//Render the stage
		this.PIXI.renderer.render(this.PIXI.stage)
	}

	//Add an arrow
	public addArrow(a: Arrow): void {
		this.gameObjects.push(a)
	}

	//Remove an arrow
	public removeArrow(a: Arrow): void {
		console.log("Remove arrow")
		this.character.unsubscribe(a)

		let index = this.gameObjects.indexOf(a)
		if (index !== -1) {
			this.gameObjects.splice(index, 1);
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
			for (let o of this.gameObjects) {
				//Type guarding
				if (o instanceof Arrow) {
					let platformsVsArrows = this.bump.hit(p, o.getColliderSprite(), false, true, true)
					if (platformsVsArrows) {
						o.stopMoving()
					}
				}
			}
		}
	}

	private checkDummyVsArrows(): void {
		// let index = 0
		for (let o of this.gameObjects) {
			//Type guarding
			if (o instanceof Arrow) {
				let dummyVsArrows = this.bump.hit(this.targetDummy.getColliderSprite(), o.getColliderSprite(), false, true, true)
				if (dummyVsArrows) {
					o.stopMoving()
					this.setScore()
				}
			}
		}
	}

	private createScoreText(): void {
		//Make custom text style
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
	}

	private setScore(): void {
		for (let o of this.gameObjects) {
			//Type guarding
			if (o instanceof TargetDummy) {
				o.timesHit++
				this.points += 10
				this.scoreText.text = "Score: " + this.points
				console.log("Score: " + this.points)
			}
		}
	}

	//Get instance of PIXI
	public getPIXI(): PIXI.Application {
		return this.PIXI
	}

	//Get instance of Bump
	public getBump(): any {
		return this.bump
	}

	//Get platforms
	public getPlatforms(): Array<PIXI.extras.AnimatedSprite> {
		return this.platforms
	}
}

window.addEventListener("load", () => {
	Game.instance()
})