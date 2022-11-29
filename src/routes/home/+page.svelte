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
	const media_data = data.tweets.includes?.media || []

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

	const media_data_map = media_data.reduce((map, media) => {
		map.set(media.media_key ?? '', media)
		return map
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	}, new Map<string, components['schemas']['Media']>())
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
	<a href={tweet.status_url} class="tweet_container">
		<div class="element">
			{#if tweet.is_retweet}
				<div class="retweet_row">
					<div class="avatar_above"><div class="retweet_icon"><Retweet /></div></div>
					{tweet.retweet_user_name}さんがリツイートしました
				</div>
			{/if}
			<div class="tweet">
				<div class="avatar_container">
					<a href={tweet.profile_url}>
						<img class="avatar" src={tweet.profile_image_url} alt="avatar" />
					</a>
				</div>
				<div class="tweet_body">
					<div class="text_column">
						<div class="username_row">
							<div class="name overflow_ellipsis">{tweet.name}</div>
							<div class="overflow_ellipsis">@{tweet.username}</div>
							<div>·</div>
							<div class="time">{tweet.elapsed_time}</div>
						</div>
						<div dir="auto">
							{@html tweet.html_text}
						</div>
					</div>
					<div class="media_frame media_column">
						<div class="media_row">
							<div class="media_cell">
								<img
									alt="画像"
									src="https://pbs.twimg.com/media/FikYru6XoAAshkj?format=jpg&amp;name=small"
									class="media"
								/>
							</div>
							<div class="media_cell">
								<img
									alt="画像"
									src="https://pbs.twimg.com/media/FimjZqxUUAAozrX?format=jpg&name=small"
									class="media"
								/>
							</div>
						</div>
						<div class="media_row">
							<div class="media_cell">
								<img
									alt="画像"
									src="https://pbs.twimg.com/media/FimjZqzVEAAIiSS?format=jpg&name=small"
									class="media"
								/>
							</div>
							<div class="media_cell">
								<img
									alt="画像"
									src="https://pbs.twimg.com/media/Fik7ftHaEAQGfw8?format=jpg&name=medium"
									class="media"
								/>
							</div>
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
	</a>
{/each}

<style>
	:global(body) {
		font-family: 'Segoe UI', Meiryo, system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
	}

	:root {
		--gray-color: rgb(83, 100, 113);
		--text-color: rgb(15, 20, 25);
		--link-color: rgb(29, 155, 240);
	}

	:global(a) {
		text-decoration: none;
	}
	:global(a:link) {
		color: var(--link-color);
	}
	:global(a:visited) {
		color: var(--link-color);
	}
	:global(a:hover) {
		color: var(--link-color);
		text-decoration: underline;
	}
	:global(a:active) {
		color: var(--link-color);
	}

	.tweet_container:hover {
		text-decoration: none;
	}

	.element {
		padding: 10px;
		border-bottom: 1px solid rgb(239, 243, 244);
		display: flex;
		flex-direction: column;
		gap: 6px;
		cursor: pointer;
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
		fill: currentColor;
	}

	.avatar_above {
		min-width: 48px;
		display: flex;
		align-items: center;
		justify-content: flex-end;
	}

	.retweet_icon {
		width: 16px;
	}

	.tweet {
		display: flex;
		flex-direction: row;
		gap: 8px;
	}

	.avatar_container {
		border-radius: 50%;
		border: 0;
		min-width: 48px;
		height: 48px;
		overflow: hidden;
	}

	.avatar {
		transition: 0.2s;
		width: 100%;
		height: 100%;
		/* background-color: black; */
	}

	.avatar:hover {
		transition: 0.2s;
		filter: brightness(0.8);
		/* opacity: 0.8; */
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
		fill: currentColor;
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

	.action_icon {
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

	.media_frame {
		border-radius: 16px;
		border-style: solid;
		border-width: 1px;
		border-color: rgb(207, 217, 222);
		max-width: 506px;
		/* max-height: 285px; */
		aspect-ratio: 506 / 282;
		overflow: hidden;
	}

	.media_column {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.media_row {
		display: flex;
		flex-direction: row;
		gap: 2px;

		min-height: 0;
		flex: 1;
	}

	.media_cell {
		flex: 1;
	}

	.media {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
</style>
