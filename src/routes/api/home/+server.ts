import { type RequestHandler, json } from '@sveltejs/kit'
import Client from 'twitter-api-sdk'

export const GET: RequestHandler = async ({ locals }) => {
	if (!locals.user) {
		return new Response('Not signed in', { status: 500, headers: { error_code: '1' } })
	}

	const twitterClient = new Client(locals.user.access_token)

	try {
		const tweets = await twitterClient.tweets.usersIdTimeline(locals.user.twitter_id, {
			// max_results: 30,
			expansions: [
				'author_id',
				'referenced_tweets.id',
				'referenced_tweets.id.author_id',
				'attachments.media_keys',
			],
			'tweet.fields': ['created_at', 'public_metrics', 'entities'],
			'user.fields': ['profile_image_url'],
			'media.fields': ['preview_image_url', 'url'],
			// 'tweet.fields': ['author_id'],
			// 'tweet.fields': ['created_at', 'entities', 'public_metrics'],
		})

		// console.log('tweets', tweets)
		// console.log('media', tweets.includes?.media)

		return json(tweets)
	} catch (err) {
		console.error(err)
		return new Response('Error loading tweets', { status: 500, headers: { error_code: '2' } })
	}
}
