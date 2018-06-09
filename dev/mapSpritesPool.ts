class MapSpritesPool {
	private sprites: Array<PIXI.Sprite>
	constructor() {
		this.sprites = []
		let id = Game.instance().PIXI().loader.resources["./images/tilesheet.json"].textures
		this.addMapSprites(6, id)
	}

	private addMapSprites(amount: number,id: any) {
		for (let i = 0; i < amount; i++) {
			let sprite = new PIXI.Sprite(id["1.png"]);
			this.sprites.push(sprite);
		}
	};
}