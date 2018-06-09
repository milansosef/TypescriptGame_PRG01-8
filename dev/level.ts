class Level {
	// private sprite: PIXI.Sprite
	// private mapSpritesPool: MapSpritesPool
	private sprites: Array<PIXI.Sprite>

	constructor(stage: PIXI.Container) {
		// this.mapSpritesPool = new MapSpritesPool()
		this.sprites = new Array()
		let id = PIXI.loader.resources["./assets/tilesheet.json"].textures

		this.createGroundRow(stage, id, 10)
	}

	private createGroundRow(stage: any, id: any, num: number): void {
		for (let i = 0; i < num; i++) {
			let sprite = new PIXI.Sprite(id["2.png"])
			sprite.position.x = i * sprite.width
			sprite.position.y = Game.instance().canvasHeigth - sprite.height
			this.sprites.push(sprite)
			stage.addChild(sprite)
		}
	}
}