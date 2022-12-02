import { TWITTER_CLIENT_ID, TWITTER_CLIENT_SECRET, TWITTER_CALLBACK_URL } from '$env/static/private'
import { Auth } from '$lib/auth'
import { Database } from '$lib/database'
import { redirect, type RequestHandler } from '@sveltejs/kit'
import { Client, auth } from 'twitter-api-sdk'
// import { TwitterApi } from 'twitter-api-v2'

console.log('TWITTER_CALLBACK_URL', TWITTER_CALLBACK_URL)

const authClient = new auth.OAuth2User({
	client_id: TWITTER_CLIENT_ID,
	client_secret: TWITTER_CLIENT_SECRET,
	callback: TWITTER_CALLBACK_URL,
	scopes: ['tweet.read', 'users.read', 'tweet.write'],
})

const twitterClient = new Client(authClient)
const STATE = 'my-state-twitter-app'

export const POST: RequestHandler = async () => {
	const authUrl = authClient.generateAuthURL({
		state: STATE,
		code_challenge_method: 's256',
	})

	throw redirect(302, authUrl)
}

export const GET: RequestHandler = async ({ cookies, url }) => {
	const state = url.searchParams.get('state')
	const code = url.searchParams.get('code') ?? ''

	if (state !== STATE) return new Response("State isn't matching", { status: 500 })

	try {
		const token = await authClient.requestAccessToken(code)

		// console.log(token)

		const access_token = token.token.access_token

		// console.log(access_token)

		if (!access_token) return new Response('No token', { status: 500 })

		const twitter_user = await twitterClient.users.findMyUser()
		const twitter_id = twitter_user.data?.id ?? ''
		const username = twitter_user.data?.username ?? ''
		const user_key = `twitter:${twitter_id}:${username}`

		// console.log(user_key)

		// const twitterClient = new TwitterApi(token)
		// const credentials = await twitterClient.v1.verifyCredentials()
		// const email = credentials.email

		// console.log(email)

		const user = await Database.upsert_user(twitter_id, access_token)

		if (!user) return new Response('No user', { status: 500 })

		await Auth.sign_in(user.id, cookies)

		throw redirect(302, '/')
	} catch (error) {
		throw redirect(302, '/')
	}

	// return new Response('Success')
}
