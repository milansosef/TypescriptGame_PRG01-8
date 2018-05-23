class Game {
	private static instance: Game
	private character: Character
	private arrows: Array<Arrow>

	private constructor() {
		this.character = new Character()
		this.arrows = new Array<Arrow>()

		this.gameLoop()
	}

	// Singleton
	public static getInstance() {
		if (!Game.instance) {
			Game.instance = new Game()
		}
		return Game.instance
	}

	private gameLoop(): void {
		this.character.update()

		requestAnimationFrame(() => this.gameLoop())
	}

	public addArrow(a: Arrow): void {
		this.arrows.push(a)
	}

}

window.addEventListener("load", () => {
	Game.getInstance()
})