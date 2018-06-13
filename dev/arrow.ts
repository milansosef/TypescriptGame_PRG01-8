/// <reference path="./gameObject" />

//Make arrow an observer listens to a subject.
//Key f -> fire button. Maak this subject. 
//if f pressed -> put all arrows on fire.
class Arrow extends GameObject {

	constructor(character_x: number, character_y: number, aimAngle: number, s: number) {
		super('./assets/images/Arrow.png', 60, 10)
		this.speed = s

		//Set arrow starting position
		this.object.x = character_x
		this.object.y = character_y
		
		//Set sprite width and height
		this.sprite.width = 200
		this.sprite.height = 200

		//Set starting rotation of the arrow
		this.colliderSprite.rotation = aimAngle

		//Set arrow speed
		this.xSpeed = Math.cos(this.colliderSprite.rotation) * this.speed
		this.ySpeed = Math.sin(this.colliderSprite.rotation) * this.speed
	}

	update() {
		super.update()
		this.checkOutofScreen()

		//Shooting angles on the leftside
		let rightUp = this.colliderSprite.rotation < 0 && this.colliderSprite.rotation > Math.PI / -2
		let rightDown = this.colliderSprite.rotation < Math.PI / 2 && this.colliderSprite.rotation > 0

		//Rotate arrow right
		if (rightUp || rightDown) {
			this.colliderSprite.rotation += 0.01
		}
		//Rotate arrow left
		else {
			this.colliderSprite.rotation -= 0.01
		}

		this.sprite.rotation = this.colliderSprite.rotation
		this.ySpeed += 0.1 //Gravity

		//Apply speed
		this.colliderSprite.x += this.xSpeed
		this.colliderSprite.y += this.ySpeed
	}

	private checkOutofScreen(): void {
		if (this.object.position.x < 0 - this.object.width || this.object.position.x > Game.instance().canvasWidth) {
			this.removeMe()
			console.log("remove")
		}
	}
}