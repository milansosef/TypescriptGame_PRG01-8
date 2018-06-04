/// <reference path="./gameObject" />

//Make arrow an observer listens to a subject.
//Key f -> fire button. Maak this subject. 
//if f pressed -> put all arrows on fire.
class Arrow extends GameObject {
	constructor(character_x: number, character_y: number, aimAngle: number) {
		super('./images/Arrow.png')
		this.sprite.x = character_x
		this.sprite.y = character_y

		this.sprite.width = 200
		this.sprite.height = 200

		this.sprite.rotation = aimAngle

		this.x_speed = Math.cos(this.sprite.rotation) * 10
		this.y_speed = Math.sin(this.sprite.rotation) * 10

		console.log('sprite.rotation: ' + this.sprite.rotation)
	}

	update() {
		super.update()
		this.checkOutofScreen()

		// //Shooting angles on the leftside
		let rightUp = this.sprite.rotation < 0 && this.sprite.rotation > Math.PI / -2
		let rightDown = this.sprite.rotation < Math.PI / 2 && this.sprite.rotation > 0

		// Rotate arrow right
		if (rightUp || rightDown) {
			this.sprite.rotation += 0.01
		}
		// Rotate arrow left
		else {
			this.sprite.rotation -= 0.01
		}

		this.y_speed += 0.1 //Gravity
		//Apply speed
		this.sprite.x += this.x_speed
		this.sprite.y += this.y_speed
	}

	private checkOutofScreen(): void {
		if (this.sprite.position.x < 0 - this.sprite.width || this.sprite.position.x > Game.getInstance().canvasWidth) {
			this.removeMe()
		}
	}
}