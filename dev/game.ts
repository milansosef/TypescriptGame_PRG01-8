class Game {
	private static instance: Game
	private character: Character

	private constructor() {
		console.log("Game running!")
		this.character = new Character()

		this.gameLoop()
	}

	public static getInstance() {
		if (!Game.instance) {
			Game.instance = new Game()
		}
		return Game.instance
	}

	private gameLoop():void {
		this.character.update()
		
		requestAnimationFrame(() => this.gameLoop())
	}

}

window.addEventListener("load", () => {
	Game.getInstance()
});