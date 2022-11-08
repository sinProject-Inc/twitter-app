import { redirect } from '@sveltejs/kit'
import Client from 'twitter-api-sdk'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) throw redirect(302, '/')

	const client = new Client(locals.user.access_token)

	const tweets = await client.tweets.usersIdTimeline(locals.user.twitter_id)
	// console.log(tweets)

	// const t2 = await client.tweets.usersIdTweets(locals.user.twitter_id)
	// console.log('t2--------------------', t2)

	// const tweet = await client.tweets.findTweetById('25')
	// console.log(tweet)

	return {
		tweets,
	}
}
