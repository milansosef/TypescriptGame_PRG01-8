/// <reference path="./gameObject" />

class Arrow extends GameObject {
	private angle: number
	private speed_x: number
	private speed_y: number


	constructor(character_x: number, character_y: number, aimAngle:number) {
		super("arrow", './images/Arrow.png')
		this.posx = character_y
		this.posy = character_x
		
		this.angle = aimAngle
		this.speed_x = Math.cos(this.angle / 180 * Math.PI) * 10
		this.speed_y = Math.sin(this.angle / 180 * Math.PI) * 10
	}

	update() {
		super.update()
		this.posx += this.speed_x;
    this.posy += this.speed_y;
	}
}