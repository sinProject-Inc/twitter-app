<script lang="ts">
	import Like from '$lib/icons/like.svelte'
	import Reply from '$lib/icons/reply.svelte'
	import Retweet from '$lib/icons/retweet.svelte'
	import { Tweet } from '$lib/tweet'
	import type { components } from 'twitter-api-sdk/dist/types'
	import type { PageData } from './$types'

	export let data: PageData

	// console.log(data.tweets)

	const tweets_data = data.tweets.data || []
	const users_data = data.tweets.includes?.users || []
	const referenced_tweets_data = data.tweets.includes?.tweets || []

	const user_data_map = users_data.reduce((map, user) => {
		map.set(user.id, user)
		return map
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	}, new Map<string, components['schemas']['User']>())

	const referenced_tweets_data_map = referenced_tweets_data.reduce((map, tweet) => {
		map.set(tweet.id, tweet)
		return map
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	}, new Map<string, components['schemas']['Tweet']>())
</script>

<svelte:head>
	<title>Home / Twitter App</title>
</svelte:head>

<form action="/sign_out" method="POST">
	<button type="submit">Sign out</button>
</form>

<br />

<!-- {$page.data.user.twitter_id} -->

{#each tweets_data as tweet_data}
	{@const tweet = new Tweet(tweet_data, user_data_map, referenced_tweets_data_map)}
	<div class="element">
		{#if tweet.is_retweet}
			<div class="retweet_row">
				<div class="avatar_above"><div class="retweet_icon"><Retweet /></div></div>
				{tweet.retweet_user_name}さんがリツイートしました
			</div>
		{/if}
		<div class="tweet">
			<img class="avatar" src={tweet.profile_image_url} alt="avatar" />
			<div class="tweet_body">
				<div class="text_column">
					<div class="username_row">
						<div class="name overflow_ellipsis">{tweet.name}</div>
						<div class="overflow_ellipsis">@{tweet.username}</div>
						<div>·</div>
						<div class="time">{tweet.elapsed_time}</div>
					</div>
					<div dir="auto">
						{tweet.text}
					</div>
				</div>
				<div class="action_row">
					<div class="action">
						<div class="action_icon">
							<div class="tap_area" />
							<Reply />
						</div>
						<div class="icon_text overflow_ellipsis">{tweet.reply_count}</div>
					</div>
					<div class="action">
						<div class="action_icon">
							<div class="tap_area" />
							<Retweet />
						</div>
						<div class="icon_text overflow_ellipsis">{tweet.retweet_count}</div>
					</div>
					<div class="action">
						<div class="action_icon">
							<div class="tap_area" />
							<Like />
						</div>
						<div class="icon_text overflow_ellipsis">{tweet.like_count}</div>
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

	:root {
		--gray-color: rgb(83, 100, 113);
		--text-color: rgb(15, 20, 25);
	}

	.element {
		padding: 10px;
		border-bottom: 1px solid rgb(239, 243, 244);
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	.element:hover {
		transition: 0.2s;
		background-color: rgb(245, 248, 250);
	}

	.retweet_row {
		display: flex;
		flex-direction: row;
		gap: 8px;
		align-items: center;
		color: var(--gray-color);
		font-weight: 700;
		font-size: 13px;
		line-height: 16px;
	}

	.avatar_above {
		min-width: 48px;
		display: flex;
		align-items: center;
		justify-content: flex-end;
	}

	:global(.retweet_icon) {
		width: 16px;
		fill: var(--gray-color);
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
		gap: 12px;
		min-width: 0;
		flex: auto;

		font-size: 15px;
		font-weight: 400;
		line-height: 20px;
	}

	.text_column {
		display: flex;
		flex-direction: column;
		gap: 8px;
		min-width: 0;
		overflow-wrap: break-word;
		color: var(--text-color);
	}

	.username_row {
		display: flex;
		flex-direction: row;
		gap: 4px;
		align-items: center;

		color: var(--gray-color);
		font-weight: 400;
		font-size: 15px;
		line-height: 20px;
	}

	.overflow_ellipsis {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.name {
		color: rgb(15, 20, 25);
		font-weight: 700;
	}

	.time {
		white-space: nowrap;
	}

	.action_row {
		display: flex;
		flex-direction: row;
		gap: 10px;
		align-items: center;

		color: var(--gray-color);
		line-height: 16px;
		font-size: 13px;
	}

	.action {
		display: flex;
		flex-direction: row;
		gap: 10px;
		align-items: center;
		flex: 1;
	}

	.icon_text {
		font-size: 14px;
	}

	:global(.action_icon) {
		width: 17.5px;
		height: 17.5px;
		position: relative;
		fill: var(--gray-color);
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
