class GameObject {
	protected sprite = new PIXI.Sprite()
	private imgSource: string

	protected speed: number = 0
	protected x_speed: number = 0
	protected y_speed: number = 0

	constructor(img: string) {
		this.imgSource = img
		this.sprite.texture = PIXI.loader.resources[this.imgSource].texture
		Game.instance().getPIXI().stage.addChild(this.sprite)

		// center the sprite's anchor point
		this.sprite.anchor.x = 0.5
		this.sprite.anchor.y = 0.5
	}

	public getRect() {
		return this.sprite.getBounds()
	}

	public getSprite(): PIXI.Sprite {
		return this.sprite
	}

	public update(): void {}

	public removeMe(): void {
		//TODO: Remove sprite
		// this.sprite.removeAllListeners()
	}

}