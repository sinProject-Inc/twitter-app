import type { components } from 'twitter-api-sdk/dist/types'

export class Tweet {
	private static _base_url = 'https://twitter.com/'

	private readonly _target_tweet_data: components['schemas']['Tweet']
	private readonly _target_user_data: components['schemas']['User'] | undefined
	private readonly _self_user_data: components['schemas']['User'] | undefined

	public constructor(
		private readonly _tweet_data: components['schemas']['Tweet'],
		private readonly _user_data_map: Map<string, components['schemas']['User']>,
		private readonly _referenced_tweet_data_map: Map<string, components['schemas']['Tweet']>,
		private readonly _media_data_map: Map<string, components['schemas']['Media']>
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
		return this._target_user_data?.profile_image_url?.replace('_normal', '_x96') ?? ''
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

	public get html_text(): string {
		const text = this.text
		const urls = this._target_tweet_data.entities?.urls ?? []
		const mentions = this._target_tweet_data.entities?.mentions ?? []
		const hashtags = this._target_tweet_data.entities?.hashtags ?? []

		let html_text = text

		html_text = html_text.replaceAll('\n', '<br>')

		for (const url of urls) {
			const url_text = url.url ?? ''
			const expanded_url = url.expanded_url ?? ''
			const display_url = url.display_url ?? ''

			// console.log('expanded_url', expanded_url)
			// console.log('status_url', this.status_url)

			const link = expanded_url.startsWith(this.status_url)
				? ''
				: `<a href="${expanded_url}">${display_url}</a>`

			html_text = html_text.replace(url_text, link)
		}

		for (const mention of mentions) {
			const mention_text = mention.username ?? ''
			const mention_url = `${Tweet._base_url}${mention_text}`

			html_text = html_text.replace(
				`@${mention_text}`,
				`<a href="${mention_url}">@${mention_text}</a>`
			)
		}

		for (const hashtag of hashtags) {
			const hashtag_text = hashtag.tag ?? ''
			const hashtag_url = `${Tweet._base_url}hashtag/${hashtag_text}`

			html_text = html_text.replace(
				`#${hashtag_text}`,
				`<a href="${hashtag_url}">#${hashtag_text}</a>`
			)
		}

		return html_text
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

	public get quote_count(): string {
		return this._count_to_text(this._target_tweet_data.public_metrics?.quote_count)
	}

	public get status_url(): string {
		return `/${this.username}/status/${this._target_tweet_data.id}`
	}

	public get profile_url(): string {
		return `${Tweet._base_url}${this.username}`
	}

	public get created_at(): string {
		return this._target_tweet_data.created_at ?? ''
	}

	public get media_count(): number {
		return this._target_tweet_data.attachments?.media_keys?.length ?? 0
	}

	public get media_data_exists(): boolean {
		const media_keys = this._target_tweet_data.attachments?.media_keys

		if (!media_keys) return true

		for (const media_key of media_keys) {
			const media_data = this._media_data_map.get(media_key)

			if (!media_data) return false
 		}

		return true
	}

	public get target_tweet_id(): string {
		return this._target_tweet_data.id
	}

	private _media_url(index: number): string {
		// console.log('text', this.text)

		const media_key = this._target_tweet_data.attachments?.media_keys?.[index]
		// console.log('media_key', media_key)

		if (!media_key) return ''

		const media_data = this._media_data_map.get(media_key)
		// console.log('media_data', media_data)

		if (!media_data) return ''

		if (media_data.type === 'photo') {
			const photo_data = media_data as components['schemas']['Photo']
			const url = photo_data.url ?? 'no photo url'

			// console.log('photo url', url)
			return url
		}

		if (media_data.type === 'animated_gif') {
			const animated_gif_data = media_data as components['schemas']['AnimatedGif']

			const url = animated_gif_data.preview_image_url ?? 'no animated_git preview_image_url'

			// console.log('animated_gif url', url)
			return url
		}

		if (media_data.type === 'video') {
			const video_data = media_data as components['schemas']['Video']
			const url = video_data.preview_image_url ?? 'no video preview_image_url'

			// console.log('animated_gif url', url)
			return url
		}

		// console.log('unknown type', media_data)

		return ''
	}

	public get media_url_0(): string {
		return this._media_url(0)
	}

	public get media_url_1(): string {
		return this._media_url(1)
	}
	public get media_url_2(): string {
		return this._media_url(2)
	}

	public get media_url_3(): string {
		return this._media_url(3)
	}

	public get counts_html_text(): string {
		const retweet_count = this.retweet_count
		const quote_count = this.quote_count
		const like_count = this.like_count
		// const reply_count = this.reply_count

		const counts = []

		if (retweet_count) {
			counts.push(`<div><span class="count">${retweet_count}</span>&nbsp;件のリツイート</div>`)
		}

		if (quote_count) {
			counts.push(`<div><span class="count">${quote_count}</span>&nbsp;件の引用リツイート</div>`)
		}

		if (like_count) {
			counts.push(`<div><span class="count">${like_count}</span>&nbsp;件のいいね</div>`)
		}

		// if (reply_count) {
		// 	counts.push(`<div><span class="count">${reply_count}</span>&nbsp;件の返信</div>`)
		// }

		return counts.join('')
	}

	// public get media_url(): string {
	// 	const media_keys = this._target_tweet_data.attachments?.media_keys ?? []

	// 	// return this._target_tweet_data.attachments?.media_keys[0] ?? ''
	// }
}
