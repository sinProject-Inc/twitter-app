import { Auth } from '$lib/auth'
import { CookiesManager } from '$lib/cookies_manager'
import type { Handle } from '@sveltejs/kit'
// import { locale } from 'svelte-i18n'

// export const handle: Handle = async ({ event, resolve }) => resolve(event)

export const handle: Handle = async ({ event, resolve }) => {
	// const lang = event.request.headers.get('accept-language')?.split(',')[0]
	// if (lang) locale.set(lang)

	const cookiesManager = new CookiesManager(event.cookies) 
	const session_id = cookiesManager.session_id
	if (!session_id) return await resolve(event)

	const auth_token = await Auth.find_auth_token(session_id)
	if (!auth_token) return await resolve(event)

	await Auth.access_valid(auth_token.id, event.cookies)

	event.locals.user = {
		twitter_id: auth_token.user.twitter_id,
		access_token: auth_token.user.access_token,
	}

	return await resolve(event)
}
