class GameObject {
	protected element: HTMLElement
	protected posy: number
	protected posx: number

	constructor(e: string) {
		this.element = document.createElement(e)
		let foreground = document.getElementsByTagName("foreground")[0]
		foreground.appendChild(this.element)

		this.posy = 0;
		this.posx = 0;
	}

	public getRect(): ClientRect {
		return this.element.getBoundingClientRect()
	}

	public update(): void {
		this.element.style.transform = `translate(${this.posx}px, ${this.posy}px)`
	}

	public removeMe(): void {
		this.element.remove()
	}

}