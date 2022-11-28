import type { components } from 'twitter-api-sdk/dist/types'

export class Tweet {
	private readonly _target_tweet_data: components['schemas']['Tweet']
	private readonly _target_user_data: components['schemas']['User'] | undefined
	private readonly _self_user_data: components['schemas']['User'] | undefined

	public constructor(
		private readonly _tweet_data: components['schemas']['Tweet'],
		private readonly _user_data_map: Map<string, components['schemas']['User']>,
		private readonly _referenced_tweet_data_map: Map<string, components['schemas']['Tweet']>
	) {
		this._target_tweet_data = this._get_target_tweet_data()
		this._target_user_data = this._get_user()
		this._self_user_data = this._get_user(true)
	}

	private _get_target_tweet_data(): components['schemas']['Tweet'] {
		if (this._tweet_data.referenced_tweets) {
			const referenced_tweet_data = this._tweet_data.referenced_tweets[0]

			if (referenced_tweet_data?.type === 'retweeted') {
				return this._referenced_tweet_data_map.get(referenced_tweet_data.id) ?? this._tweet_data
			}
		}

		return this._tweet_data
	}

	private _get_user(is_self = false): components['schemas']['User'] | undefined {
		const target_tweet = is_self ? this._tweet_data : this._target_tweet_data

		return this._user_data_map.get(target_tweet.author_id ?? '')
	}

	public get is_retweet(): boolean {
		return (
			this._tweet_data.referenced_tweets?.some(
				(referenced_tweet) => referenced_tweet.type === 'retweeted'
			) ?? false
		)
	}

	public get retweet_user_name(): string {
		return this._self_user_data?.name ?? ''
	}

	public get profile_image_url(): string {
		return this._target_user_data?.profile_image_url ?? ''
	}

	public get name(): string {
		return this._target_user_data?.name ?? ''
	}

	public get username(): string {
		return this._target_user_data?.username ?? ''
	}

	private _to_local_date(date: string | undefined): string {
		if (!date) return ''

		// TODO: set locale
		return new Date(date).toLocaleString('ja-JP')
	}

	public get local_created_at(): string {
		const local_created_at = this._to_local_date(this._target_tweet_data.created_at)

		return local_created_at
	}

	public get month_day(): string {
		const created_at = this._target_tweet_data.created_at

		if (!created_at) return ''

		const date = new Date(created_at)
		// const year = date.getFullYear()
		const month = date.getMonth() + 1
		const day = date.getDate()

		return `${month}月${day}日`
	}

	public get elapsed_time(): string {
		const created_at = this._target_tweet_data.created_at

		if (!created_at) return ''

		const elapsed_time = new Date().getTime() - new Date(created_at).getTime()
		const elapsed_time_seconds = elapsed_time / 1000
		const elapsed_time_minutes = elapsed_time_seconds / 60
		const elapsed_time_hours = elapsed_time_minutes / 60
		const elapsed_time_days = elapsed_time_hours / 24

		if (elapsed_time_days > 1) return this.month_day
		// if (elapsed_time_days > 1) return `${Math.floor(elapsed_time_days)}日前`
		if (elapsed_time_hours > 1) return `${Math.floor(elapsed_time_hours)}時間`
		if (elapsed_time_minutes > 1) return `${Math.floor(elapsed_time_minutes)}分`
		return `${Math.floor(elapsed_time_seconds)}秒`
	}

	public get text(): string {
		return this._target_tweet_data.text ?? ''
	}

	private _count_to_text(data_count: number | undefined): string {
		const count = data_count ?? 0
		// TODO: set locale
		return count > 0 ? count.toLocaleString('ja-JP') : ''
	}

	public get retweet_count(): string {
		return this._count_to_text(this._target_tweet_data.public_metrics?.retweet_count)
	}

	public get like_count(): string {
		return this._count_to_text(this._target_tweet_data.public_metrics?.like_count)
	}

	public get reply_count(): string {
		return this._count_to_text(this._target_tweet_data.public_metrics?.reply_count)
	}

	// public get media_url(): string {
	// 	const media_keys = this._target_tweet_data.attachments?.media_keys ?? []

	// 	// return this._target_tweet_data.attachments?.media_keys[0] ?? ''
	// }
}
