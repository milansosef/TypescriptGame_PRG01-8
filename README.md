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

```typescript
public static instance() {
  if (!Game.game_instance) {
	  Game.game_instance = new Game()
	}
	return Game.game_instance
}
```

## Polymorphism

## Strategy

## Observer

## Game Comcponents

## UML

Pull request week 4 for Typescript game @BrandonYuen.
https://github.com/BrandonYuen/PRG01-8_Game/pull/1

Peer review week 6 for Typescript game @BrandonYuen.
https://github.com/BrandonYuen/PRG01-8_Game/issues/2
