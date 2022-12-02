<script lang="ts">
	import Like from '$lib/icons/like.svelte'
	import Reply from '$lib/icons/reply.svelte'
	import RetweetSmall from '$lib/icons/retweet_small.svelte'
	import Retweet from '$lib/icons/retweet.svelte'
	import { Tweet } from '$lib/tweet'
	import { Util } from '$lib/util'
	import type { PageData } from './$types'
	import UpArrow from '$lib/icons/up_arrow.svelte'
	import ThreeDot from '$lib/icons/three_dot.svelte'

	export let data: PageData

	// console.log(data.tweets)

	const tweets_data = data.tweets.data || []
	const users_data = data.tweets.includes?.users || []
	const referenced_tweets_data = data.tweets.includes?.tweets || []
	const media_data = data.tweets.includes?.media || []

	const user_data_map = Util.to_map_by_id(users_data)
	const referenced_tweets_data_map = Util.to_map_by_id(referenced_tweets_data)
	const media_data_map = Util.to_map_by_media_key(media_data)

	function on_click_tweet(tweet: Tweet): void {
		const selection = window.getSelection()

		if (selection?.isCollapsed) {
			location.href = tweet.status_url
		}
	}
</script>

<svelte:head>
	<title>Home / Twitter App</title>
</svelte:head>

<form action="/sign_out" method="POST">
	<button type="submit">Sign out</button>
</form>

<br />

<div class="root_container">
	<div />
	<div class="main_container">
		<div class="header">
			<div class="header_row">
				<div class="header_icon">
					<img
						src="/images/sinProject-07.png"
						alt="ロゴ"
						width="100%"
						style="position: absolute; top: 2px;"
					/>
				</div>
				最新ツイート
				<div class="spacer" />
				<div class="header_icon">
					<div class="tap_area" />
					<ThreeDot />
				</div>
			</div>
		</div>

		{#each tweets_data as tweet_data}
			{@const tweet = new Tweet(
				tweet_data,
				user_data_map,
				referenced_tweets_data_map,
				media_data_map
			)}
			<div class="element" on:click={() => on_click_tweet(tweet)} on:keypress>
				{#if tweet.is_retweet}
					<div class="retweet_row">
						<div class="avatar_above"><div class="retweet_icon"><RetweetSmall /></div></div>
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
								<div class="name overflow_ellipsis">
									<a href={tweet.profile_url}>{tweet.name}</a>
								</div>
								<div class="username overflow_ellipsis">
									<a href={tweet.profile_url}>@{tweet.username}</a>
								</div>
								<div>·</div>
								<div class="time">
									<a href={tweet.status_url}>
										<time datetime={tweet.created_at}>{tweet.elapsed_time}</time>
									</a>
								</div>
								<div class="spacer" />
								<div class="action_icon">
									<div class="tap_area" />
									<ThreeDot />
								</div>
							</div>
							<div dir="auto">
								{@html tweet.html_text}
							</div>
						</div>

						{#if tweet.media_count === 1}
							<div class="media_frame">
								<img alt="画像" src={tweet.media_url_0} class="media" />
							</div>
						{:else if tweet.media_count === 2}
							<div class="media_frame media_column media_frame_tile">
								<div class="media_row">
									<div class="media_cell">
										<img alt="画像" src={tweet.media_url_0} class="media" />
									</div>
									<div class="media_cell">
										<img alt="画像" src={tweet.media_url_1} class="media" />
									</div>
								</div>
							</div>
						{:else if tweet.media_count === 3}
							<div class="media_frame media_row media_frame_tile">
								<div class="media_cell">
									<img alt="画像" src={tweet.media_url_0} class="media" />
								</div>
								<div class="media_column">
									<div class="media_cell">
										<img alt="画像" src={tweet.media_url_1} class="media" />
									</div>
									<div class="media_cell">
										<img alt="画像" src={tweet.media_url_2} class="media" />
									</div>
								</div>
							</div>
						{:else if tweet.media_count === 4}
							<div class="media_frame media_column media_frame_tile">
								<div class="media_row">
									<div class="media_cell">
										<img alt="画像" src={tweet.media_url_0} class="media" />
									</div>
									<div class="media_cell">
										<img alt="画像" src={tweet.media_url_1} class="media" />
									</div>
								</div>
								<div class="media_row">
									<div class="media_cell">
										<img alt="画像" src={tweet.media_url_2} class="media" />
									</div>
									<div class="media_cell">
										<img alt="画像" src={tweet.media_url_3} class="media" />
									</div>
								</div>
							</div>
						{/if}

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
							<div class="action_up_arrow">
								<div class="action_icon">
									<div class="tap_area" />
									<UpArrow />
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		{/each}
	</div>
	<div />
</div>

<style>
	:global(body) {
		font-family: 'Segoe UI', Meiryo, system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
		margin: 0;
	}

	:root {
		--gray-color: rgb(83, 100, 113);
		--text-color: rgb(15, 20, 25);
		--link-color: rgb(29, 155, 240);
		--border-color: rgb(239, 243, 244);
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

	.root_container {
		display: flex;
		flex-direction: row;
		gap: 1px;
		background-color: var(--border-color);
		min-height: 100vh;
	}

	.root_container > * {
		flex: auto;
		background-color: white;
	}

	.main_container {
		margin: 0 auto;
		max-width: 600px;
		min-width: 0;
	}

	.header {
		-webkit-position: sticky;
		position: sticky;
		top: 0;
		height: 53px;
		backdrop-filter: blur(12px);
		background-color: rgba(255, 255, 255, 0.85);
		padding-left: 16px;
		padding-right: 16px;
		font-size: 22px;
		font-weight: 700;
	}

	.header_row {
		display: flex;
		align-items: center;
		height: 100%;
		gap: 40px;
	}

	.header_icon {
		width: 20px;
		height: 20px;
		position: relative;
	}

	.element {
		padding: 16px;
		border-bottom: 1px solid var(--border-color);
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
		gap: 12px;
		align-items: center;
		color: var(--gray-color);
		font-size: 13px;
		line-height: 16px;
		font-weight: 700;
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
		height: 16px;
	}

	.tweet {
		display: flex;
		flex-direction: row;
		gap: 12px;
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

		font-size: 16px;
		line-height: 20px;
		font-weight: 400;
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

	.name a {
		color: rgb(15, 20, 25);
	}

	.username a {
		color: var(--gray-color);
	}

	.spacer {
		flex: auto;
	}

	.username a:hover {
		text-decoration: none;
	}

	.time {
		white-space: nowrap;
	}

	.time a {
		color: var(--gray-color);
	}

	.action_row {
		display: flex;
		flex-direction: row;
		gap: 10px;
		align-items: center;

		color: var(--gray-color);
		font-size: 13px;
		line-height: 16px;
	}

	.action {
		display: flex;
		flex-direction: row;
		gap: 10px;
		align-items: center;
		flex: 1;
	}

	.action_up_arrow {
		display: flex;
		flex-direction: row;
		flex: 0;
	}

	.icon_text {
		font-size: 14px;
	}

	.action_icon {
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

	.media_frame {
		border-radius: 16px;
		border-style: solid;
		border-width: 1px;
		border-color: rgb(207, 217, 222);
		/* max-height: 285px; */
		overflow: hidden;
	}

	.media_frame_tile {
		aspect-ratio: 506 / 282;
	}

	.media_column {
		display: flex;
		flex-direction: column;
		gap: 2px;

		flex: 1;
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
		min-height: 0;
	}

	.media {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
</style>
