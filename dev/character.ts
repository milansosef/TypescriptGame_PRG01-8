/// <reference path="./gameObject" />

class Character extends GameObject {
	private left: boolean = false
	private right: boolean = false
	private up: boolean = false
	private isOnGround: boolean = true
	private jumpHeight: number = 40
	private gravity: number = 1.5
	// private frictionX: number

	private aimAngle: number = 0
	private isReloading: boolean = false

	constructor() {
		super('./assets/images/archer.png', 60, 120)

		//Set the sprites width and height
		this.sprite.width = 200
		this.sprite.height = 200

		//Set the sprites position
		this.colliderSprite.x = Game.instance().getPIXI().stage.width / 2 - this.sprite.width / 2
		this.colliderSprite.y = Game.instance().getPIXI().stage.height / 2 - this.sprite.height / 2

		// Add listeners
		window.addEventListener("keydown", (e: KeyboardEvent) => this.keyListener(e))
		window.addEventListener("keyup", (e: KeyboardEvent) => this.keyListener(e))
		window.addEventListener("mousemove", (e: MouseEvent) => this.updateAim(e))
		Game.instance().getPIXI().stage.on("mousedown", () => this.shoot())
	}

	public update(): void {
		super.update()

		if (this.up && this.isOnGround == true) {
			this.ySpeed -= this.jumpHeight
			this.isOnGround = false
		}

		if (this.left) {
			this.xSpeed -= 0.5
		}

		if (this.right) {
			this.xSpeed += 0.5
		}

		//Gravity
		this.ySpeed += this.gravity

		//Friction
		this.xSpeed *= 0.9
		this.ySpeed *= 0.9
		
		//Adjust speed
		this.colliderSprite.x += this.xSpeed
		this.colliderSprite.y += this.ySpeed
	}

	//TODO: Set speed based on bow drag
	private shoot(): void {

		//Set speed multiplier
		let arrowSpeed = 10

		//Shoot an arrow
		Game.instance().addArrow(new Arrow(this.colliderSprite.x, this.colliderSprite.y, this.aimAngle, arrowSpeed))
	}

	private updateAim(event: MouseEvent): void {
		//Aiming direction
		let mouseX = event.clientX
		let mouseY = event.clientY

		mouseX -= this.colliderSprite.x
		mouseY -= this.colliderSprite.y

		this.aimAngle = Math.atan2(mouseY, mouseX)
	}

	public handleCollision(collision: any, platform: any) {
		if (collision) {
			if (collision === "bottom" && this.ySpeed >= 0) {
				// console.log("Collision at bottom")

				//Tell the game that the character is on the ground if
				//it's standing on top of a platform
				this.isOnGround = true;

				//Neutralize gravity by applying its
				//exact opposite force to the character's ySpeed
				this.ySpeed -= this.gravity;
			}
			else if (collision === "top" && this.ySpeed <= 0) {
				this.ySpeed = 0;
				// console.log("Collision at top")
			}
			else if (collision === "right" && this.xSpeed >= 0) {
				this.xSpeed = 0;
				// console.log("Collision at right")
			}
			else if (collision === "left" && this.xSpeed <= 0) {
				this.xSpeed = 0;
				// console.log("Collision at left")
			}

			//Set `isOnGround` to `false` if the bottom of the player
			//isn't touching the platform
			if (collision !== "bottom" && this.ySpeed > 0) {
				this.isOnGround = false;
			}
		}
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