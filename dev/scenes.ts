interface Scene {
  paused: boolean

	update(): void

	pause(): void
	
	resume(): void
	
	isPaused(): void
}
