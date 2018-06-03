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

		//TODO: Fix arrow not rotating at PI radius
		//Shooting angles on the rightside
		let leftUp = this.sprite.rotation <= Math.PI / -2 && this.sprite.rotation >= Math.PI * -1
		let leftDown = this.sprite.rotation <= Math.PI && this.sprite.rotation >= Math.PI / 2

		//Shooting angles on the leftside
		let rightUp = this.sprite.rotation < 0 && this.sprite.rotation > Math.PI / -2
		let rightDown = this.sprite.rotation < Math.PI / 2 && this.sprite.rotation > 0

		// Rotate arrow left
		if (leftUp || leftDown) {
			this.sprite.rotation -= 0.01
		}
		// Rotate arrow right
		if (rightUp || rightDown) {
			this.sprite.rotation += 0.01
		}


		this.y_speed += 0.1 //Gravity
		this.sprite.x += this.x_speed
		this.sprite.y += this.y_speed
	}
}