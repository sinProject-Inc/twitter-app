import { redirect } from '@sveltejs/kit'
import { Client } from 'twitter-api-sdk'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ locals, params }) => {
	if (!locals.user) throw redirect(302, '/')

	const { username, id } = params

	console.log('username:', username)
	console.log('id:', id)

	const client = new Client(locals.user.access_token)
	
	try {
		const tweet = await client.tweets.findTweetById(id, {
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

		console.log('tweet', tweet)

		return {
			tweet,
		}
	} catch (error) {
		console.error(error)
		throw redirect(302, '/sign_out')
		// throw Error('Error loading tweets')
	}
}

