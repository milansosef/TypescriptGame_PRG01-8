class TargetDummy extends GameObject {
	constructor() {
		super("./assets/images/dummy_1.png", 40, 50)

		// this.
		console.log(this.sprite.x)
		this.object.x = 600
		this.object.y = 344
	}
}