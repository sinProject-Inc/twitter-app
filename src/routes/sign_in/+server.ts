import { Auth } from '$lib/auth'
import { Database } from '$lib/database'
import { Twitter } from '$lib/twitter'
import { redirect, type RequestHandler } from '@sveltejs/kit'

export const POST: RequestHandler = async () => {
	const auth_url = await Twitter.generate_auth_url()

	throw redirect(302, auth_url)
}

export const GET: RequestHandler = async ({ cookies, url }) => {
	try {
		const login_result = await Twitter.sign_in(url, cookies)

		if (login_result instanceof Response) {
			return login_result
		}

		const user = await Database.upsertUser(login_result)

		if (!user) {
			return new Response('Something went wrong!', { status: 500 })
		}

		await Auth.signIn(user.id, cookies)

		throw redirect(302, '/main')
	}
	catch (error) {
		console.error(error)
		throw redirect(302, '/')
	}
}
