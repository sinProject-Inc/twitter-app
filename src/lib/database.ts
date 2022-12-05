import prisma, { type User } from '@prisma/client'

enum Roles {
	admin = 'admin',
	user = 'user',
}

export const db = new prisma.PrismaClient()

export class Database {
	public static async upsert_user(twitter_id: string, access_token: string, refresh_token: string): Promise<User | undefined> {
		return await db.user.upsert({
			where: { twitter_id },
			update: { access_token, refresh_token },
			create: { twitter_id, access_token, refresh_token, role: { connect: { name: Roles.user } } },
		})
	}

	public static async get_app_setting_int(key: string): Promise<number> {
		const appSetting = await db.appSetting.findUnique({ where: { key } })
		const number_value = Number(appSetting?.value)
		const number_value_not_nan = Number.isNaN(number_value) ? 0 : number_value

		return number_value_not_nan
	}
}
