/// <reference path="./gameObject" />

class Character extends GameObject {
	private movementController: movementController
	private left: boolean = false
	private right: boolean = false
	private up: boolean = false

	private aimAngle: number = 0
	private isReloading: boolean = false
	private isJumping: boolean = false

	constructor() {
		super('./assets/images/archer.png')
		this.movementController = new movementController(this)

		//Set the sprites width and height
		this.sprite.width = 200
		this.sprite.height = 200

		//Set the sprites position
		this.sprite.position.x = Game.instance().getPIXI().stage.width / 2 - this.sprite.width / 2
		this.sprite.position.y = Game.instance().getPIXI().stage.height / 2 - this.sprite.height / 2

		// Add listeners
		window.addEventListener("keydown", (e: KeyboardEvent) => this.keyListener(e))
		window.addEventListener("keyup", (e: KeyboardEvent) => this.keyListener(e))
		window.addEventListener("mousemove", (e: MouseEvent) => this.updateAim(e))
		Game.instance().getPIXI().stage.on("mousedown", () => this.shoot())
	}

	public update(): void {
		super.update()
		this.movementController.update()
	}

	private shoot(): void {
		//TODO: Set speed based on bow drag
		//Set speed multiplier
		let arrowSpeed = 10

		//Shoot an arrow
		Game.instance().addArrow(new Arrow(this.sprite.x, this.sprite.y, this.aimAngle, arrowSpeed))
	}

	private updateAim(event: MouseEvent): void {
		//Aiming direction
		let mouseX = event.clientX
		let mouseY = event.clientY

		mouseX -= this.sprite.x
		mouseY -= this.sprite.y

		this.aimAngle = Math.atan2(mouseY, mouseX)
	}

	private keyListener(event: KeyboardEvent): void {
		let key_state: boolean = (event.type == "keydown") ? true : false

		switch (event.keyCode) {
			//SPACEBAR; Jump 
			case 32:
				this.up = key_state
				break
			//A; Walk left
			case 65:
				this.left = key_state
				break
			//D; Walk right
			case 68:
				this.right = key_state
				break
		}
	}

	//TODO: Fix removeEventlistener
	public removeMe(): void {
		super.removeMe()
		// window.removeEventListener("keydown", (e: KeyboardEvent) => this.onKeyDown(e))
		// window.removeEventListener("keyup", (e: KeyboardEvent) => this.onKeyUp(e))
	}
}