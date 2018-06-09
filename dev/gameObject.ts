class GameObject {
	protected sprite = new PIXI.Sprite()
	private imgSource: string
	protected x_speed: number = 0
	protected y_speed: number = 0

	constructor(img: string) {
		this.imgSource = img
		this.sprite.texture = PIXI.loader.resources[this.imgSource].texture
		Game.instance().PIXI().stage.addChild(this.sprite)

		// center the sprite's anchor point
		this.sprite.anchor.x = 0.5
		this.sprite.anchor.y = 0.5
	}

	public getRect() {
		return this.sprite.getBounds()
	}

	public update(): void {
		// this.sprite.updateTransform()
	}

	public removeMe(): void {
		//TODO: Remove sprite
		// this.sprite.removeAllListeners()
	}

}