/// <reference path="./gameObject" />

class Character extends GameObject {
	private left: boolean = false
	private right: boolean = false
	private up: boolean = false
	private x_velocity: number = 0
	private y_velocity: number = 0
	private isReloading: boolean = false
	private isJumping: boolean = false

	constructor() {
		super("character")
		this.posx = 0
		this.posy = 0

		window.addEventListener("keydown", (e: KeyboardEvent) => this.keyListener(e))
		window.addEventListener("keyup", (e: KeyboardEvent) => this.keyListener(e))
	}

	public update(): void {
		super.update()
		this.movementController()
	}

	private shoot(): void {
		//Shoot an arrow
		let g = Game.getInstance()
		g.addArrow(new Arrow())
	}

	private keyListener(event: KeyboardEvent): void {
		let key_state: boolean = (event.type == "keydown") ? true : false

		switch (event.keyCode) {
			//SPACEBAR; Jump 
			case 32:
				this.up = key_state
				console.log(key_state)
				break
			//A; Walk left
			case 65:
				this.left = key_state
				console.log("left")
				break
			//D; Walk right
			case 68:
				console.log("right")
				this.right = key_state
				break
		}
	}

	private movementController(): void {
		if (this.up && this.isJumping == false) {
			this.y_velocity -= 20
			this.isJumping = true
		}

		if (this.left) {
			this.x_velocity -= 0.5
		}

		if (this.right) {
			this.x_velocity += 0.5
		}

		this.y_velocity += 1.5 // gravity
		this.posx += this.x_velocity
		this.posy += this.y_velocity
		this.x_velocity *= 0.9 // friction
		this.y_velocity *= 0.9 // friction

		if (this.posy > window.innerHeight - 16 - 512) {
			this.isJumping = false
			this.posy = window.innerHeight - 16 - 512
			this.y_velocity = 0
		}
	}

	//TODO: Fix removeEventlistener
	public removeMe(): void {
		super.removeMe()
		// window.removeEventListener("keydown", (e: KeyboardEvent) => this.onKeyDown(e))
		// window.removeEventListener("keyup", (e: KeyboardEvent) => this.onKeyUp(e))
	}
}