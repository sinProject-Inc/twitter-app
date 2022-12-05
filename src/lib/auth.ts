import { TWITTER_CALLBACK_URL, TWITTER_CLIENT_ID, TWITTER_CLIENT_SECRET } from '$env/static/private'
import type { AuthToken, Role, User } from '@prisma/client'
import type { Cookies } from '@sveltejs/kit'
import { _ } from 'svelte-i18n'
import { auth } from 'twitter-api-sdk'
import { CookiesManager } from './cookies_manager'
import { Database, db } from './database'

export class Auth {
	public static async get_session_lifetime_sec(): Promise<number> {
		return await Database.get_app_setting_int('session_lifetime_sec')
	}

	public static get_limit(lifetime_sec: number): Date {
		const limit = new Date()

		if (lifetime_sec == 0) console.warn('lifetime_sec is 0')

		limit.setSeconds(limit.getSeconds() - lifetime_sec)

		return limit
	}

	public static async create_auth_token(
		user_id: number,
		session_lifetime_sec: number
	): Promise<AuthToken> {
		const session_limit = await Auth.get_limit(session_lifetime_sec)

		const [auth_token] = await db.$transaction([
			db.authToken.create({
				data: { user_id, token: crypto.randomUUID() },
			}),
			db.authToken.deleteMany({
				where: { updated_at: { lt: session_limit } },
			}),
		])

		return auth_token
	}

	public static async sign_in(user_id: number, cookies: Cookies): Promise<void> {
		const session_lifetime_sec = await Auth.get_session_lifetime_sec()
		const auth_token = await Auth.create_auth_token(user_id, session_lifetime_sec)

		new CookiesManager(cookies).set_session_id(auth_token.token)
	}

	public static async sign_out(cookies: Cookies): Promise<void> {
		const cookiesManager = new CookiesManager(cookies)

		await db.authToken.delete({ where: { token: cookiesManager.session_id } })
		cookiesManager.delete_session_id()
	}

	public static async find_auth_token(session_id: string): Promise<
		| (AuthToken & {
				user: User & {
					role: Role
				}
		  })
		| null
	> {
		const session_lifetime_sec = await Auth.get_session_lifetime_sec()
		const session_limit = Auth.get_limit(session_lifetime_sec)

		const auth_token = await db.authToken.findFirst({
			where: {
				updated_at: { gte: session_limit },
				token: session_id,
			},
			include: {
				user: {
					include: {
						role: true,
					},
				},
			},
		})

		return auth_token
	}

	public static async update_auth_token(auth_token_id: number): Promise<AuthToken> {
		const auth_token = await db.authToken.update({
			where: { id: auth_token_id },
			data: { updated_at: new Date() },
		})

		return auth_token
	}

	public static async access_valid(auth_token_id: number, cookies?: Cookies): Promise<void> {
		const auth_token = await Auth.update_auth_token(auth_token_id)
		const session_lifetime_sec = await Auth.get_session_lifetime_sec()

		if (cookies) {
			new CookiesManager(cookies).set_session_id(auth_token.token, session_lifetime_sec)
		}
	}

	public static get_auth_client(): auth.OAuth2User {
		return new auth.OAuth2User({
			client_id: TWITTER_CLIENT_ID,
			client_secret: TWITTER_CLIENT_SECRET,
			callback: TWITTER_CALLBACK_URL,
			scopes: ['tweet.read', 'users.read', 'tweet.write', 'offline.access'],
		})
	}

	public static async check_expired_token(twitter_id: string, access_token: string, refresh_token: string): Promise<string> {
		const auth_client = Auth.get_auth_client()

		auth_client.token = {
			access_token,
			refresh_token,
		}

		if (!auth_client.isAccessTokenExpired()) {
			console.log('access token is not expired')
			return access_token
		}

		console.log('access token is expired')

		const { token } = await auth_client.refreshAccessToken()

		console.log(token)

		if (!token.access_token || !token.refresh_token) return access_token

		await Database.upsert_user(twitter_id, token.access_token, token.refresh_token)

		return token.access_token
	}
}
