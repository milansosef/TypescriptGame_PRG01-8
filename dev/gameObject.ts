class GameObject {
	protected sprite = new PIXI.Sprite()
	private imgSource: string
	protected x_speed: number = 0
	protected y_speed: number = 0
	protected rotation: number

	constructor(img: string) {
		this.imgSource = img
		this.rotation = 0;
	}

	public initTexture(stage: PIXI.Container): void {
		this.sprite.texture = Game.PIXI.loader.resources[this.imgSource].texture;
		stage.addChild(this.sprite);
	}

	public getRect() {
		// return this.element.getBoundingClientRect()

		//TODO: Welke gebruiken?
		return this.sprite.getBounds()
		// return this.sprite.getLocalBounds()
	}

	public update(): void {
		// this.element.style.transform = `translate(${this.posx}px, ${this.posy}px) rotate(${this.rotation}deg)`
		// this.sprite.updateTransform()
	}

	public removeMe(): void {
		// this.element.remove()
	}

}