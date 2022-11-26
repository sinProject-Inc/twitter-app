<script lang="ts">
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

	function toLocalDate(date?: string): string {
		if (!date) return ''

		return new Date(date).toLocaleString('ja-JP')
	}

	function isRetweet(tweet: components['schemas']['Tweet']): boolean {
		return (
			tweet.referenced_tweets?.some((referenced_tweet) => referenced_tweet.type === 'retweeted') ??
			false
		)
	}

	function getTargetTweet(tweet: components['schemas']['Tweet']): components['schemas']['Tweet'] {
		if (tweet.referenced_tweets) {
			const referenced_tweet = tweet.referenced_tweets[0]

			if (referenced_tweet?.type === 'retweeted') {
				const retweeted_tweet = referenced_tweets_map.get(referenced_tweet.id)
				return retweeted_tweet ?? tweet
			}
		}

		return tweet
	}

	function getUser(
		tweet: components['schemas']['Tweet'],
		isOriginal = false
	): components['schemas']['User'] | undefined {
		const target_tweet = isOriginal ? tweet : getTargetTweet(tweet)

		return user_map.get(target_tweet.author_id ?? '')
	}

	function getText(tweet: components['schemas']['Tweet']): string {
		const target_tweet = getTargetTweet(tweet)

		return target_tweet.text ?? ''
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
		{#if isRetweet(tweet)}
			<div class="retweet_row">
				<div class="avatar_above"><div class="retweet"><Retweet /></div></div>
				{getUser(tweet, true)?.name}さんがリツイートしました
			</div>
		{/if}
		<div class="tweet">
			<img class="avatar" src={getUser(tweet)?.profile_image_url} alt="avatar" />
			<div class="text_column">
				<div class="username_row">
					<div class="name overflow_ellipsis">{getUser(tweet)?.name}</div>
					<div class="username overflow_ellipsis">@{getUser(tweet)?.username}</div>
					<div class="time">{toLocalDate(tweet.created_at)}</div>
				</div>
				{getText(tweet)}
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
		height: 22px;
	}

	.avatar_above {
		width: 48px;
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

	.text_column {
		display: flex;
		flex-direction: column;
		gap: 2px;
		min-width: 0;
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
</style>
