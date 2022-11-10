import prisma, { type User } from '@prisma/client'
import type { LoginResult } from 'twitter-api-v2'

enum Roles {
	admin = 'admin',
	user = 'user',
}

export const db = new prisma.PrismaClient()

export class Database {
	public static async upsertUser(login_result: LoginResult): Promise<User | undefined> {
		const twitter_id = login_result.userId
		const screen_name = login_result.screenName
		const access_token = login_result.accessToken
		const access_secret = login_result.accessSecret

		return await db.user.upsert({
			where: { twitter_id },
			update: { screen_name, access_token, access_secret },
			create: {
				twitter_id, 
				screen_name,
				access_token,
				access_secret,
				role: { connect: { name: Roles.user } },
			},
		})
	}

	public static async getAppSettingInt(key: string): Promise<number> {
		const appSetting = await db.appSetting.findUnique({ where: { key } })
		const number_value = Number(appSetting?.value)
		const number_value_not_nan = Number.isNaN(number_value) ? 0 : number_value

		return number_value_not_nan
	}
}
