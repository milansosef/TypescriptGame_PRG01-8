class Afraid implements Behavior {
	targetDummy: TargetDummy

	constructor(t: TargetDummy) {
		this.targetDummy = t
	}

	performBehavior(): void {
		this.targetDummy.getSprite().texture = PIXI.loader.resources["./assets/images/dummy_2.png"].texture	
	}
}