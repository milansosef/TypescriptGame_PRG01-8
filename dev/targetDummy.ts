class TargetDummy extends GameObject {
	public dummyBehaviour: dummyBehaviour
	public timesHit: number = 0

	constructor() {
		super("./assets/images/dummy_1.png", 40, 60)
		
		this.object.x = 600
		this.object.y = 344
	}

	public update(): void {
		switch (this.timesHit) {
			case 0:
				this.dummyBehaviour = new Idle(this)
				break
			case 1:
				this.dummyBehaviour = new Afraid(this)
				break
			case 2:
				this.dummyBehaviour = new Crying(this)
				break
		}

		this.dummyBehaviour.performBehavior()
	}
}