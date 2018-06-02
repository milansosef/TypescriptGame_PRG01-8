/// <reference path="./gameObject" />

class Arrow extends GameObject {
	constructor(character_x: number, character_y: number, aimAngle: number) {
		super('./images/Arrow.png')
		this.sprite.x = character_x
		this.sprite.y = character_y
		// this.sprite.position.x = character_x
		// this.sprite.position.y = character_y

		this.sprite.width = 200
		this.sprite.height = 200

		this.sprite.rotation = aimAngle

		this.x_speed = Math.cos(this.sprite.rotation) * 10
		this.y_speed = Math.sin(this.sprite.rotation) * 10

		console.log('sprite.rotation: ' + this.sprite.rotation)
	}

	update() {
		super.update()

		// See if arrow is shot left or right
		// console.log("sprite.rotation = " + this.sprite.rotation)

		// Fall to right
		if (this.sprite.rotation > -90 && this.sprite.rotation < 90) {
			this.sprite.rotation += 0.01
		}

		// if(this.sprite.rotation > 0) {
		// 	this.sprite.rotation += 0.01
		// } else {
		// 	this.sprite.rotation -= 0.01
		// }

		// else if ((this.sprite.rotation < -90 && this.sprite.rotation >= -181) || (this.sprite.rotation <= 180 && this.sprite.rotation > 90)) {
		// 	if (this.sprite.rotation < -180) {
		// 		this.sprite.rotation = 180
		// 	}
		// 	this.sprite.rotation += 0.01
		// }

		this.y_speed += 0.1
		this.sprite.x += this.x_speed
		this.sprite.y += this.y_speed
	}
}