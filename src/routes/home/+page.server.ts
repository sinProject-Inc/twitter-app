import { redirect } from '@sveltejs/kit'
import { Client } from 'twitter-api-sdk'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) throw redirect(302, '/')

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

		// if (tweets.data) {
		// 	for (const tweet of tweets.data) {
		// 		console.log('referenced', tweet.referenced_tweets)
		// 	}
		// }
		const retweetIds = []
		if (tweets.data) {
			for (const tweet of tweets.data) {
				if (tweet.referenced_tweets) {
					for (const refTweet of tweet.referenced_tweets) {
						if (refTweet.type == "retweeted") {
							retweetIds.push(refTweet.id)
						}
					}
				}
			}
		}

		const retweets = await twitterClient.tweets.findTweetsById({
			ids: retweetIds,
			expansions: [
				'attachments.media_keys',
			],
			'media.fields': ['preview_image_url', 'url'],
		})

		if (tweets.includes?.media && retweets.includes?.media) {
			tweets.includes.media.push(...retweets.includes.media)
		}

		console.log('tweets', tweets)
		console.log('media', tweets.includes?.media)
		// console.log(tweets.includes?.users)
		// console.log(tweets.includes?.tweets)

		return {
			tweets,
		}
	} catch (error) {
		console.error(error)
		throw redirect(302, '/sign_out')
		// throw Error('Error loading tweets')
	}
}
