<script lang="ts">
	import Analytics from '$lib/icons/analytics.svelte'
	import LeftArrow from '$lib/icons/left_arrow.svelte'
	import Like from '$lib/icons/like.svelte'
	import Reply from '$lib/icons/reply.svelte'
	import RetweetSmall from '$lib/icons/retweet_small.svelte'
	import Retweet from '$lib/icons/retweet.svelte'
	import ThreeDot from '$lib/icons/three_dot.svelte'
	import UpArrow from '$lib/icons/up_arrow.svelte'
	import { Tweet } from '$lib/tweet'
	import { Util } from '$lib/util'
	import type { PageData } from './$types'

	export let data: PageData

	const tweet_data = data.tweet.data
	const users_data = data.tweet.includes?.users || []
	const referenced_tweets_data = data.tweet.includes?.tweets || []
	const media_data = data.tweet.includes?.media || []

	const user_data_map = Util.to_map_by_id(users_data)
	const referenced_tweets_data_map = Util.to_map_by_id(referenced_tweets_data)
	const media_data_map = Util.to_map_by_media_key(media_data)

	if (!tweet_data) throw new Error('tweet_data is null')

	const tweet = new Tweet(tweet_data, user_data_map, referenced_tweets_data_map, media_data_map)
</script>

<svelte:head>
	<title>Home / Twitter App</title>
</svelte:head>

<div class="root_container">
	<div />
	<div class="main_container">
		<div class="header">
			<div class="header_row">
				<div class="header_icon">
					<div class="tap_area" on:click={() => history.back()} on:keydown />
					<LeftArrow />
				</div>
				ツイート
			</div>
		</div>

		<div class="element">
			{#if tweet.is_retweet}
				<div class="retweet_row">
					<div class="avatar_above"><div class="retweet_icon"><RetweetSmall /></div></div>
					{tweet.retweet_user_name}さんがリツイートしました
				</div>
			{/if}
			<div class="tweet">
				<div class="avatar_row">
					<div class="avatar_container">
						<a href={tweet.profile_url}>
							<img class="avatar" src={tweet.profile_image_url} alt="avatar" />
						</a>
					</div>
					<div class="username_row">
						<div class="username_column">
							<div class="name overflow_ellipsis">
								<a href={tweet.profile_url}>{tweet.name}</a>
							</div>
							<div class="username overflow_ellipsis">
								<a href={tweet.profile_url}>@{tweet.username}</a>
							</div>
						</div>
						<div class="spacer" />
						<div class="three_dot_icon">
							<div class="tap_area" />
							<ThreeDot />
						</div>
					</div>
				</div>

				<div class="tweet_body">
					<div class="text_column">
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
				</div>
			</div>
			<div class="bottom_element">
				<div class="time">
					{tweet.local_created_at}
				</div>
				<div class="analytics_row">
					<div class="analytics_icon">
						<Analytics />
					</div>
					ツイートアナリティクスを表示
				</div>
				<div class="counts_row">
					{@html tweet.counts_html_text}
				</div>
				<div class="action_row">
					<div class="action" style="text-align: center">
						<div class="action_icon">
							<div class="tap_area" />
							<Reply />
						</div>
					</div>
					<div class="action">
						<div class="action_icon">
							<div class="tap_area" />
							<Retweet />
						</div>
					</div>
					<div class="action">
						<div class="action_icon">
							<div class="tap_area" />
							<Like />
						</div>
					</div>
					<div class="action">
						<div class="action_icon">
							<div class="tap_area" />
							<UpArrow />
						</div>
					</div>
				</div>
				<div />
			</div>
		</div>
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
		gap: 4px;
	}

	.retweet_row {
		display: flex;
		flex-direction: row;
		gap: 12px;
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
		height: 16px;
	}

	.tweet {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.avatar_row {
		display: flex;
		flex-direction: row;
		align-items: center;
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

		font-size: 25px;
		line-height: 29px;
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
		flex: auto;

		font-weight: 400;
		font-size: 15px;
		line-height: 20px;
	}

	.username_column {
		display: flex;
		flex-direction: column;
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

	.username a:hover {
		text-decoration: none;
	}

	.spacer {
		flex: auto;
	}

	.bottom_element {
		display: flex;
		flex-direction: column;
		gap: 1px;
		background-color: var(--border-color);
		justify-content: center;
	}

	.bottom_element > * {
		background-color: white;
		min-height: 50px;
		display: flex;
		flex-direction: row;
		align-items: center;
		font-size: 15px;
		color: var(--gray-color);
		fill: var(--gray-color);
	}

	.analytics_row {
		display: flex;
		flex-direction: row;
		gap: 4px;
	}

	.analytics_icon {
		width: 20px;
		height: 20px;
	}

	.counts_row {
		display: flex;
		flex-direction: row;
		gap: 20px;
		flex-wrap: wrap;
	}

	:global(.count) {
		color: var(--text-color);
		font-weight: 700;
	}

	.action_row {
		display: flex;
		flex-direction: row;
		gap: 10px;
		align-items: center;
		justify-content: center;

		color: var(--gray-color);
		line-height: 16px;
		font-size: 13px;
	}

	.action {
		flex: 1;
	}

	.three_dot_icon {
		width: 18.75px;
		height: 18.75px;
		position: relative;
		margin: 0 auto;
		fill: var(--gray-color);
	}

	.action_icon {
		width: 22.5px;
		height: 22.5px;
		position: relative;
		margin: 0 auto;
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
		overflow: hidden;

		display: flex;
		flex-direction: row;
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
