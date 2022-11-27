<script lang="ts">
	import Like from '$lib/icons/like.svelte'
	import Reply from '$lib/icons/reply.svelte'
	import Retweet from '$lib/icons/retweet.svelte'
	import type { components } from 'twitter-api-sdk/dist/types'
	import type { PageData } from './$types'

	export let data: PageData

	// console.log(data.tweets)

	const tweets = data.tweets.data || []
	const users = data.tweets.includes?.users || []
	const referenced_tweets = data.tweets.includes?.tweets || []

	const user_map = users.reduce((map, user) => {
		map.set(user.id, user)
		return map
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	}, new Map<string, components['schemas']['User']>())

	const referenced_tweets_map = referenced_tweets.reduce((map, tweet) => {
		map.set(tweet.id, tweet)
		return map
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	}, new Map<string, components['schemas']['Tweet']>())

	// // eslint-disable-next-line @typescript-eslint/no-explicit-any
	// function get_retweeted(tweet: any): any {
	// 	if (tweet.referenced_tweets) {
	// 		const referenced_tweet = tweet.referenced_tweets[0]

	// 		if (referenced_tweet?.type === 'retweeted') {
	// 			const retweeted_tweet = referenced_tweets_map.get(referenced_tweet.id)
	// 			const retweeted_user = user_map.get(retweeted_tweet?.author_id)

	// 			return { tweet: retweeted_tweet, user: retweeted_user }
	// 		}
	// 	}
	// }

	// const timeline = tweets.map((tweet) => {
	// 	const user = user_map.get(tweet.author_id ?? '')
	// 	const retweeted = get_retweeted(tweet)

	// 	return { tweet, user, retweeted }
	// })

	// console.log(timeline)

	function is_retweet(tweet: components['schemas']['Tweet']): boolean {
		return (
			tweet.referenced_tweets?.some((referenced_tweet) => referenced_tweet.type === 'retweeted') ??
			false
		)
	}

	function get_target_tweet(tweet: components['schemas']['Tweet']): components['schemas']['Tweet'] {
		if (tweet.referenced_tweets) {
			const referenced_tweet = tweet.referenced_tweets[0]

			if (referenced_tweet?.type === 'retweeted') {
				const retweeted_tweet = referenced_tweets_map.get(referenced_tweet.id)
				return retweeted_tweet ?? tweet
			}
		}

		return tweet
	}

	function get_user(
		tweet: components['schemas']['Tweet'],
		is_original = false
	): components['schemas']['User'] | undefined {
		const target_tweet = is_original ? tweet : get_target_tweet(tweet)

		return user_map.get(target_tweet.author_id ?? '')
	}

	function to_local_date(date?: string): string {
		if (!date) return ''

		return new Date(date).toLocaleString('ja-JP')
	}

	function get_local_date(tweet: components['schemas']['Tweet']): string {
		const target_tweet = get_target_tweet(tweet)

		return to_local_date(target_tweet.created_at)
	}

	function get_text(tweet: components['schemas']['Tweet']): string {
		const target_tweet = get_target_tweet(tweet)

		return target_tweet.text ?? ''
	}

	function get_retweet_count(tweet: components['schemas']['Tweet']): string {
		const target_tweet = get_target_tweet(tweet)

		const count = target_tweet.public_metrics?.retweet_count ?? 0 
		const count_text = count > 0 ? count.toLocaleString('ja-JP') : ''

		return count_text
	}

	function get_reply_count(tweet: components['schemas']['Tweet']): string {
		const target_tweet = get_target_tweet(tweet)

		const count = target_tweet.public_metrics?.reply_count ?? 0 
		const count_text = count > 0 ? count.toLocaleString('ja-JP') : ''

		return count_text
	}

	function get_like_count(tweet: components['schemas']['Tweet']): string {
		const target_tweet = get_target_tweet(tweet)

		const count = target_tweet.public_metrics?.like_count ?? 0 
		const count_text = count > 0 ? count.toLocaleString('ja-JP') : ''

		return count_text
	}

	// console.log(tweets)
</script>

<svelte:head>
	<title>Home / Twitter App</title>
</svelte:head>

<form action="/sign_out" method="POST">
	<button type="submit">Sign out</button>
</form>

<br />

<!-- {$page.data.user.twitter_id} -->

{#each tweets as tweet}
	<div class="element">
		{#if is_retweet(tweet)}
			<div class="retweet_row">
				<div class="avatar_above"><div class="retweet"><Retweet /></div></div>
				{get_user(tweet, true)?.name}さんがリツイートしました
			</div>
		{/if}
		<div class="tweet">
			<img class="avatar" src={get_user(tweet)?.profile_image_url} alt="avatar" />
			<div class="tweet_body">
				<div class="text_column">
					<div class="username_row">
						<div class="name overflow_ellipsis">{get_user(tweet)?.name}</div>
						<div class="username overflow_ellipsis">@{get_user(tweet)?.username}</div>
						<div class="time">{get_local_date(tweet)}</div>
					</div>
					{get_text(tweet)}
				</div>
				<div class="action_row">
					<div class="action">
						<div class="icon">
							<div class="tap_area" />
							<Reply />
						</div>
						<div class="icon_text overflow_ellipsis">{get_reply_count(tweet)}</div>
					</div>
					<div class="action">
						<div class="icon">
							<div class="tap_area" />
							<Retweet />
						</div>
						<div class="icon_text overflow_ellipsis">{get_retweet_count(tweet)}</div>
					</div>
					<div class="action">
						<div class="icon">
							<div class="tap_area" />
							<Like />
						</div>
						<div class="icon_text overflow_ellipsis">{get_like_count(tweet)}</div>
					</div>
				</div>
			</div>
		</div>
	</div>
{/each}

<style>
	:global(body) {
		font-family: 'Segoe UI', Meiryo, system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
	}

	.element {
		padding: 10px;
		border-bottom: 1px solid #ccc;
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	.retweet_row {
		display: flex;
		flex-direction: row;
		gap: 8px;
		align-items: center;
	}

	.avatar_above {
		min-width: 48px;
		display: flex;
		align-items: center;
		justify-content: flex-end;
	}

	.retweet {
		width: 16px;
	}

	.tweet {
		display: flex;
		flex-direction: row;
		gap: 8px;
	}

	.avatar {
		border-radius: 50%;
		width: 48px;
		height: 48px;
	}

	.tweet_body {
		display: flex;
		flex-direction: column;
		gap: 8px;
		min-width: 0;
		flex: auto;
	}

	.text_column {
		display: flex;
		flex-direction: column;
		gap: 8px;
		min-width: 0;
		overflow-wrap: break-word;
	}

	.username_row {
		display: flex;
		flex-direction: row;
		gap: 8px;
		align-items: center;
	}

	.overflow_ellipsis {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.name {
		font-weight: bold;
	}

	.username {
		color: #666;
	}

	.time {
		color: #666;
		white-space: nowrap;
	}

	.action_row {
		display: flex;
		flex-direction: row;
		gap: 8px;
		align-items: center;
	}

	.action {
		display: flex;
		flex-direction: row;
		gap: 8px;
		align-items: center;
		flex: 1;
	}

	.icon_text {
		font-size: 14px;
	}

	.icon {
		width: 17.5px;
		height: 17.5px;
		position: relative;
	}

	.tap_area {
		cursor: pointer;
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		margin: -8px;
	}
</style>
