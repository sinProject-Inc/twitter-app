import type { Cookies } from "@sveltejs/kit";
import { TwitterApi, type LoginResult } from "twitter-api-v2";

export class Twitter {
	public readonly client: TwitterApi

	constructor(access_token = '', access_secret = '') {
		this.client = new TwitterApi({
			appKey: process.env.TWITTER_CONSUMER_KEY ?? '',
			appSecret: process.env.TWITTER_CONSUMER_SECRET ?? '',
			accessToken: access_token,
			accessSecret: access_secret,
		})
	}

	static async generate_auth_url(): Promise<string> {
		const twitter = new Twitter()
		const result = await twitter.client.generateAuthLink(
			process.env.TWITTER_AUTH_CALLBACK_URL ?? ''
		)

		return result.url
	}

	static async sign_in(url: URL, cookies: Cookies): Promise<Response | LoginResult> {
		const oauth_token = url.searchParams.get('oauth_token')
		const oauth_verifier = url.searchParams.get('oauth_verifier')
		const oauth_token_secret = cookies.get('JSESSIONID')

		// console.log('oauth_token', oauth_token)
		// console.log('oauth_verifier', oauth_verifier)
		// console.log('oauth_token_secret', oauth_token_secret)

		if (!oauth_token || !oauth_verifier || !oauth_token_secret) {
			return new Response('You denied the app or your session expired!', { status: 400 })
		}

		const twitter = new Twitter(oauth_token, oauth_token_secret)
		const login_result = await twitter.client.login(oauth_verifier)

		return login_result
	}
}