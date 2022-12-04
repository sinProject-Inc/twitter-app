import { type RequestHandler, json } from '@sveltejs/kit'
import Client from 'twitter-api-sdk'

export const GET: RequestHandler = async ({ locals, params }) => {
	if (!locals.user) {
		return new Response('Not signed in', { status: 500, headers: { error_code: '1' } })
	}

		const { ids } = params

		if (!ids) return new Response('No id', { status: 500, headers: { error_code: '3' } })

		console.log('ids:', ids)

		const id_array = ids.split(',')


	const twitterClient = new Client(locals.user.access_token)

	try {
		const tweets = await twitterClient.tweets.findTweetsById({
			ids: id_array,
			expansions: [
				'author_id',
				'referenced_tweets.id',
				'referenced_tweets.id.author_id',
				'attachments.media_keys',
			],
			'tweet.fields': ['created_at', 'public_metrics', 'entities'],
			'user.fields': ['profile_image_url'],
			'media.fields': ['preview_image_url', 'url'],
		})

		console.log('tweets', tweets)

		return json(tweets)
	} catch (err) {
		console.error(err)
		return new Response('Error loading tweets', { status: 500, headers: { error_code: '2' } })
	}
}
