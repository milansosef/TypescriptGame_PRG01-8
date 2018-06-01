/// <reference path="./gameObject" />

class Character extends GameObject {
	private left: boolean = false
	private right: boolean = false
	private up: boolean = false
	private aimAngle: number = 0
	private isReloading: boolean = false
	private isJumping: boolean = false

	constructor() {
		super('./images/archer.png')

		this.sprite.width = 200
		this.sprite.height = 200

		window.addEventListener("mousemove", (e: MouseEvent) => this.onMouseMove(e))
		window.addEventListener("click", (e: MouseEvent) => this.onClickListener(e))
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
		g.addArrow(new Arrow(this.sprite.x, this.sprite.y, this.aimAngle))
		console.log("PIXI rotation = " + this.sprite.rotation)
		console.log("AIMAngle = " + this.aimAngle)
	}

	private onClickListener(event: MouseEvent): void {
		this.shoot()
	}

	private onMouseMove(event: MouseEvent): void {
		let g = Game.getInstance()

		//TODO: Fix bullet starting and shooting direction
		// let mouseX = event.clientX - g.canvas.getBoundingClientRect().left
		// let mouseY = event.clientY - g.canvas.getBoundingClientRect().top
		let mouseX = event.clientX
		let mouseY = event.clientY

		mouseX -= this.sprite.x + this.getRect().width / 2
		mouseY -= this.sprite.y + this.getRect().height / 2

		this.aimAngle = Math.atan2(mouseY, mouseX) / Math.PI * 180
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
			this.y_speed -= 20
			this.isJumping = true
		}

		if (this.left) {
			this.x_speed -= 0.5
		}

		if (this.right) {
			this.x_speed += 0.5
		}

		this.y_speed += 1.5 // gravity
		this.sprite.x += this.x_speed
		this.sprite.y += this.y_speed
		this.x_speed *= 0.9 // friction
		this.y_speed *= 0.9 // friction

		if (this.sprite.y > window.innerHeight - 16 - 512) {
			this.isJumping = false
			this.sprite.y = window.innerHeight - 16 - 512
			this.y_speed = 0
		}
	}

	//TODO: Fix removeEventlistener
	public removeMe(): void {
		super.removeMe()
		// window.removeEventListener("keydown", (e: KeyboardEvent) => this.onKeyDown(e))
		// window.removeEventListener("keyup", (e: KeyboardEvent) => this.onKeyUp(e))
	}
}