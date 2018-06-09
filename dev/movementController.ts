//TODO: Strategy pattern
class movementController {
	character: any

	constructor(c: any) {
		this.character = c
	}

	public update(): void {
		if (this.character.up && this.character.isJumping == false) {
			this.character.y_speed -= 80
			this.character.isJumping = true
		}

		if (this.character.left) {
			this.character.x_speed -= 0.5
		}

		if (this.character.right) {
			this.character.x_speed += 0.5
		}

		//Apply speed
		this.character.sprite.x += this.character.x_speed
		this.character.sprite.y += this.character.y_speed

		//Gravity
		this.character.y_speed += 1.5 
		
		//Friction
		this.character.x_speed *= 0.9
		this.character.y_speed *= 0.9

		//Temporary ground collision
		if (this.character.sprite.y > window.innerHeight - 150) {
			this.character.isJumping = false
			this.character.sprite.y = window.innerHeight - 150
			this.character.y_speed = 0
		}
	}
}
