class Crying implements dummyBehaviour {
	public targetDummy: TargetDummy

	constructor(t: TargetDummy) {
		this.targetDummy = t
	}

	public performBehavior(): void {
		this.targetDummy.getSprite().texture = PIXI.loader.resources["./assets/images/dummy_3.png"].texture
	}
}