/// <reference path="./gameObject" />

class Arrow extends GameObject {
	private speed_x: number
	private speed_y: number


	constructor(character_x: number, character_y: number, aimAngle:number) {
		super("arrow", './images/Arrow.png')
		this.posx = character_x
		this.posy = character_y
		
		this.rotation = aimAngle
		this.speed_x = Math.cos(this.rotation / 180 * Math.PI) * 10
		this.speed_y = Math.sin(this.rotation / 180 * Math.PI) * 10

		console.log('rotation: '+this.rotation)
	}

	update() {
		super.update()

		// See if arrow is shot left or right
		console.log( "rotation = "+this.rotation)

		// Fall to right
		if (this.rotation > -90 && this.rotation < 90) {
			this.rotation++
		} 
		else if ((this.rotation < -90 && this.rotation >= -181) || (this.rotation <= 180 && this.rotation > 90)){
			if (this.rotation < -180) {
				this.rotation = 180
			}
			this.rotation--
		}

		this.speed_x = Math.cos(this.rotation / 180 * Math.PI) * 10
		this.speed_y = Math.sin(this.rotation / 180 * Math.PI) * 10
		this.posx += this.speed_x;
		this.posy += this.speed_y;
	}
}