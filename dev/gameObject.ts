class GameObject {
	// private canvas: HTMLCanvasElement
	// private context: CanvasRenderingContext2D
	// protected img: HTMLImageElement
	protected element: HTMLElement
	protected posy: number
	protected posx: number
	protected rotation: number

	constructor(e: string, imgSource:string) {
		this.element = document.createElement(e)
		let foreground = document.getElementsByTagName("foreground")[0]
		foreground.appendChild(this.element)
		
		// this.img = new Image()
		// this.img.src = imgSource
		// this.canvas = <HTMLCanvasElement>document.getElementById('canvas')
		// this.context = <CanvasRenderingContext2D>this.canvas.getContext("2d")

		this.posy = 0;
		this.posx = 0;
		this.rotation = 0;
	}

	public getRect(): ClientRect {
		return this.element.getBoundingClientRect()
	}

	public update(): void {
		// this.context.clearRect(0, 0, 512, 512)
		// this.context.translate(this.posx, this.posy);
		// this.context.drawImage(this.img, this.posx, this.posy, 512, 512);

		this.element.style.transform = `translate(${this.posx}px, ${this.posy}px) rotate(${this.rotation}deg)`
	}

	public removeMe(): void {
		this.element.remove()
	}

}