import { Twitter } from '$lib/twitter'
import { redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) throw redirect(302, '/')

	const twitter = new Twitter(locals.user.access_token, locals.user.access_secret)

	try {
		const home_timeline = await twitter.client.v2.homeTimeline({
			// max_results: 30,
			expansions: ['author_id'],
			'tweet.fields': ['created_at'],
			'user.fields': ['profile_image_url'],
			// 'tweet.fields': ['author_id'],
			// 'tweet.fields': ['created_at', 'entities', 'public_metrics'],
		})

		console.log('tweets --------------', home_timeline)
		// console.log(tweets.includes?.users)

	 return {
			home_timeline,
		}
	}
	catch (error) {
		throw redirect(302, '/sign_out')
	}
}
