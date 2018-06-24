# Archer practise range

Test your archery skills in the practise range. See if you can make the dummy cry!

## How to install: 

- Clone this repository.
- Run npm install in the directory of the project.
- Launch the project with your preffered hosting method. I use the plugin http-server.

Using http-server to launch the project:
- npm i http-server -g 
- http-server docs

## How to play:

Walk with 'a' and 'd'. Jump with 'spacebar'.
Press the 'f' key to give all arrows in the air a boost.

## Singleton

In my game class I make use of the singleton pattern. 

```typescript
public static instance() {
  if (!Game.game_instance) {
	  Game.game_instance = new Game()
	}
	return Game.game_instance
}

private constructor() {}
```

## Polymorphism

The use of polymorphism can be seen in multiple places in my code. The Character, TargetDummy and Arrow classes all extend the GameObject class. 

First example: 

By looping over the gameObjects array, I am using the parent's type to generically address different types of children, so I can update all gameObjects.

```typescript
for (let o of this.gameObjects) {
	o.update()
}
```
Second example:

Here I am checking if there platforms and arrows are colliding. Since a gameObject can be an instance of character, targetdummy or Arrow, I need to check if the object is an instance of Arrow. This is called type guarding. 

```typescript
private checkPlatformsVsArrows(): void {
	for (let p of this.platforms) {
		for (let o of this.gameObjects) {
			//Type guarding
			if (o instanceof Arrow) {
				let platformsVsArrows = this.bump.hit(p, o.getColliderSprite(), false, true, true)
				if (platformsVsArrows) {
					o.stopMoving()
				}
			}
		}
	}
}
```

## Strategy

I am using the strategy pattern to make the target dummy change its behavior. Depending on how many arrows you have shot at the dummy, the dummy can be idle, afraid or crying!

```typescript
switch (this.timesHit) {
case 0:
	this.dummyBehaviour = new Idle(this)
	break
case 1:
	this.dummyBehaviour = new Afraid(this)
	break
case 2:
	this.dummyBehaviour = new Crying(this)
	break
}
```

## Observer

I implemented the observer pattern in arrow and character, where the arrows are the observers and character is the subject. The arrows are being notified when the character hits the 'F' key. When this occurs, all arrows in the air will receive a boost in speed and lose gravity. I implemented this feature because I have plans to make a powerup that will give your arrows a boost.  

## Game Components

*Canvas*
Instead of DOM elements I am making use of canvas to draw the game graphics on the screen.

*External library: Pixi.js*
This game was made using Pixi.js, a 2d rendering library.

## UML

For this game I also made a UML / class diagram.

![alt text](https://drive.google.com/open?id=1hNALQPdhF5up9lZ4_mZso0Ile511ThLm)

Pull request week 4 for Typescript game @BrandonYuen.
https://github.com/BrandonYuen/PRG01-8_Game/pull/1

Peer review week 6 for Typescript game @BrandonYuen.
https://github.com/BrandonYuen/PRG01-8_Game/issues/2
