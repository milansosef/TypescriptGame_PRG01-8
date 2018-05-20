/// <reference path="./gameObject" />

class Character extends GameObject {
	private leftSpeed: number
	private rightSpeed: number

	constructor() {
		super("character")
		this.leftSpeed = 0
		this.rightSpeed = 0
		this.posx = 0
		this.posy = 300

		window.addEventListener("keydown", (e: KeyboardEvent) => this.onKeyDown(e))
		window.addEventListener("keyup", (e: KeyboardEvent) => this.onKeyUp(e))
	}

	public update() {
		super.update()
		this.posx += this.rightSpeed
		this.posx -= this.leftSpeed
	}

	onKeyDown(event: KeyboardEvent): void {
		switch (event.keyCode) {
			case 87:
				this.leftSpeed = 5
				break
			case 83:
				this.rightSpeed = 5
				break
		}
	}

	onKeyUp(event: KeyboardEvent): void {
		switch (event.keyCode) {
			case 87: 
				this.leftSpeed = 0
				break
			case 83:
				this.rightSpeed = 0
				break
		}
	}
}