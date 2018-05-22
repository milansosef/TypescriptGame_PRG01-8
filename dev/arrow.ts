/// <reference path="./gameObject" />

class Arrow extends GameObject {
	private speed: number

	constructor() {
		super("arrow")
		this.posx = 200
		this.posy = 300
		this.speed = 20
	}
}