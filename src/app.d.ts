// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
declare namespace App {
	interface Locals {
		user: {
			twitter_id: string
			access_token: string
			access_secret: string
		}
	}
	// interface PageData {}
	// interface Error {}
	// interface Platform {}
}
