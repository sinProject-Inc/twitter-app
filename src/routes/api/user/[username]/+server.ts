import { type RequestHandler, json } from '@sveltejs/kit'
import Client from 'twitter-api-sdk'

export const GET: RequestHandler = async ({ locals, params }) => {
	if (!locals.user) {
		return new Response('Not signed in', { status: 500, headers: { error_code: '1' } })
	}

	const { username } = params

	if (!username) return new Response('No username', { status: 500, headers: { error_code: '3' } })

	const twitterClient = new Client(locals.user.access_token)

	try {
		const profile = await twitterClient.users.findUserByUsername(username, {
			'user.fields': [
				'username',
				'created_at',
				'description',
				'entities',
				'id',
				'location',
				'name',
				'pinned_tweet_id',
				'profile_image_url',
				'protected',
				'public_metrics',
				'url',
				'verified',
				'withheld',
			],
		})
		return json(profile)
	} catch (err) {
		console.error(err)
		return new Response('Error loading profile', { status: 500, headers: { error_code: '2' } })
	}
}
