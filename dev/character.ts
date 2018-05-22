/// <reference path="./gameObject" />

class Character extends GameObject {
	private leftSpeed: number = 0
	private rightSpeed: number = 0
	private downSpeed: number = 0
	private upSpeed: number = 0
	private isReloading: boolean = false

	constructor() {
		super("character")
		this.posx = 0
		this.posy = 300

		window.addEventListener("keydown", (e: KeyboardEvent) => this.onKeyDown(e))
		window.addEventListener("keyup", (e: KeyboardEvent) => this.onKeyUp(e))
	}

	public update(): void {
		super.update()
		this.posx += this.rightSpeed
		this.posx -= this.leftSpeed
		this.posy -= this.upSpeed
		this.posy += this.downSpeed
	}

	private schoot(): void {
		//Shoot an arrow
		let g = Game.getInstance()
		g.addArrow(new Arrow())
	}

	//TODO: Fix removeEventlistener
	public removeMe(): void {
		super.removeMe()
		window.removeEventListener("keydown", (e: KeyboardEvent) => this.onKeyDown(e))
		window.removeEventListener("keyup", (e: KeyboardEvent) => this.onKeyUp(e))
	}

	private onKeyDown(event: KeyboardEvent): void {
		switch (event.keyCode) {
			//SPACEBAR; Jump 
			case 32:
				// event.preventDefault();
				console.log("jumping!")
				this.schoot()
				this.upSpeed = 5
				break
			//S; Down
			case 83:
				this.downSpeed = 5
				break
			//A; Walk left
			case 65:
				this.leftSpeed = 5
				break
			//D; Walk right
			case 68:
				this.rightSpeed = 5
				break
		}
	}

	private onKeyUp(event: KeyboardEvent): void {
		switch (event.keyCode) {
			//SPACEBAR; Jump 
			case 32:
				this.upSpeed = 0
				break
			//S; Down
			case 83:
				this.downSpeed = 0
				break
			//A; Walk left
			case 65:
				this.leftSpeed = 0
				break
			//D; Walk right
			case 68:
				this.rightSpeed = 0
				break
		}
	}
}