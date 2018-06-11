class Util {
	static checkCharacterVsPlatforms(c: Character): any {

		let character = c.getColliderSprite()
		let platforms: Array<PIXI.extras.AnimatedSprite> = Game.instance().getPlatforms()
		let characterVsPlatforms
		//TODO: Finish collision functionality
		for (let p of platforms) {
			// let collision = Game.instance().getBump().hit(p, character, true, true, true)
			characterVsPlatforms = Game.instance().getBump().hit(
				character,
				p,
				true, false, true,
				function (collision: any, platform: any) {
					// return collision
					console.log("Hit at" + collision)
					//`collision` tells you the side on player that the collision occurred on.
					//`platform` is the sprite from the `world.platforms` array
					//that the player is colliding with
				}
			)
			// console.log(characterVsPlatforms)
		}
		// console.log(characterVsPlatforms)
		return characterVsPlatforms

		// Game.instance().getBump().hit(
		// 	character.getSprite(),
		// 	platforms,
		// 	false, false, false,
		// 	function (collision: any, platform: any) {
		// 		console.log("Test")
		// 		// if(collision === "right"){
		// 		// 	console.log("right")
		// 		// }
		// 		console.log(collision)
		// 		return collision
		// 	}
		// )
	}
}