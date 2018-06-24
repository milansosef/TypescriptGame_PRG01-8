/// <reference path="./gameObject" />

//Make arrow an observer listens to a subject.
//Key f -> fire button. Maak this subject. 
//if f pressed -> put all arrows on fire.
class Arrow extends GameObject implements Observer {
	private boostActive: boolean = false
	private collided: boolean = false

	constructor(c: Character, character_x: number, character_y: number, aimAngle: number, s: number) {
		super('./assets/images/Arrow.png', 30, 5)
		c.subscribe(this)
		this.speed = s

		//Set arrow starting position
		this.object.x = character_x
		this.object.y = character_y

		//Set sprite width and height
		this.sprite.width = 200
		this.sprite.height = 200

		this.colliderSprite.anchor.y = -0.9

		//Set starting rotation of the arrow
		this.colliderSprite.rotation = aimAngle

		//Set arrow speed
		this.setSpeed()
	}

	public notify(): void {
		if (!this.collided) {
			//Boost arrow.
			this.boostActive = true
			this.speed = 20
			this.setSpeed()
		}
	}

	private setSpeed(): void {
		this.xSpeed = Math.cos(this.colliderSprite.rotation) * this.speed
		this.ySpeed = Math.sin(this.colliderSprite.rotation) * this.speed
	}

	public update(): void {
		super.update()
		this.checkOutofScreen()

		//Shooting angles on the leftside
		let rightUp = this.colliderSprite.rotation < 0 && this.colliderSprite.rotation > Math.PI / -2
		let rightDown = this.colliderSprite.rotation < Math.PI / 2 && this.colliderSprite.rotation > 0

		if (!this.boostActive && !this.collided) {
			this.ySpeed += 0.1 //Gravity

			//Rotate arrow right
			if (rightUp || rightDown) {
				this.colliderSprite.rotation += 0.01
			}
			//Rotate arrow left
			else {
				this.colliderSprite.rotation -= 0.01
			}
		}

		this.sprite.rotation = this.colliderSprite.rotation

		//Apply speed
		this.colliderSprite.x += this.xSpeed
		this.colliderSprite.y += this.ySpeed
	}

	public stopMoving(): void {
		this.object.removeChild(this.colliderSprite)
		this.collided = true
		this.ySpeed = 0;
		this.xSpeed = 0;

		//Remove the arrow after 5 seconds.
		setTimeout(() => {
			Game.instance().removeArrow(this)
			this.removeMe()
		}, 6000)
	}

	private checkOutofScreen(): void {
		if (this.colliderSprite.position.x < 0 - this.colliderSprite.width || this.colliderSprite.position.x > Game.instance().canvasWidth) {
			// Game.instance().removeArrow(this)
		}
	}
}