class GameObject {
	protected object = new PIXI.Container()
	protected sprite = new PIXI.Sprite()
	private imgSource: string
	protected colliderSprite: PIXI.Sprite

	protected speed: number = 0
	protected xSpeed: number = 0
	protected ySpeed: number = 0

	constructor(img: string) {
		this.imgSource = img
		this.sprite.texture = PIXI.loader.resources[this.imgSource].texture
		this.object.addChild(this.sprite)
		this.getColliderSprite()

		Game.instance().getPIXI().stage.addChild(this.object)

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

	// public getCollider(): PIXI.Graphics {
	// 	return this.collider
	// }

	public getColliderSprite() {
		if (!this.colliderSprite) {
			//Create collider rectangle
			let colliderRect = new PIXI.Graphics()
			colliderRect.beginFill(0x66CCFF)
			colliderRect.drawRect(this.sprite.x, this.sprite.y + 10, 60, 120) //100
			colliderRect.endFill()

			//Create collider texture
			let colliderTexture = Game.instance().getPIXI().renderer.generateTexture(colliderRect)

			//Create collider sprite
			this.colliderSprite = new PIXI.Sprite(colliderTexture)
			this.colliderSprite.anchor.x = 0.5
			this.colliderSprite.anchor.y = 0.5

			//Add collider sprite to object container
			this.object.addChild(this.colliderSprite)
		}
		return this.colliderSprite
	}

	public update(): void { }

	public removeMe(): void {
		//TODO: Remove sprite
		// this.sprite.removeAllListeners()
	}

}