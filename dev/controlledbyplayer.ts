//TODO: Strategy pattern
class ControlledByPlayer {
	character: Character

	private left: boolean = false
	private right: boolean = false
	private up: boolean = false
	private isJumping: boolean = false

	constructor(c: Character) {
		this.character = c
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
		this.posx += this.x_speed
		this.posy += this.y_speed
		this.x_speed *= 0.9 // friction
		this.y_speed *= 0.9 // friction

		if (this.posy > window.innerHeight - 16 - 512) {
			this.isJumping = false
			this.posy = window.innerHeight - 16 - 512
			this.y_speed = 0
		}
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
}