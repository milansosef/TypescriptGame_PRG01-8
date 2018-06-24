class TargetDummy extends GameObject {
	public behavior: Behavior
	public timesHit: number = 0

	constructor() {
		super("./assets/images/dummy_1.png", 40, 60)
		
		this.object.x = 600
		this.object.y = 344
	}

	public update(): void {
		switch (this.timesHit) {
			case 0:
				this.behavior = new Idle(this)
				break
			case 1:
				this.behavior = new Afraid(this)
				break
			case 2:
				this.behavior = new Crying(this)
				break
		}

		this.behavior.performBehavior()
	}
}