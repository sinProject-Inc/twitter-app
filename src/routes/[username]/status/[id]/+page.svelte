<script lang="ts">
	import Analytics from '$lib/icons/analytics.svelte'
	import LeftArrow from '$lib/icons/left_arrow.svelte'
	import Like from '$lib/icons/like.svelte'
	import Reply from '$lib/icons/reply.svelte'
	import Retweet from '$lib/icons/retweet.svelte'
	import RetweetSmall from '$lib/icons/retweet_small.svelte'
	import ThreeDot from '$lib/icons/three_dot.svelte'
	import UpArrow from '$lib/icons/up_arrow.svelte'
	import { Tweet } from '$lib/tweet'
	import { Util } from '$lib/util'
	import { onMount } from 'svelte'
	import type { components } from 'twitter-api-sdk/dist/types'
	import '../../../app.css'
	import { page } from '$app/stores'
	import Loading from '$lib/icons/loading.svelte'

	let tweet_data: components['schemas']['Tweet']
	let tweets_data: components['schemas']['Tweet'][] = []
	let users_data: components['schemas']['User'][] = []
	let referenced_tweets_data: components['schemas']['Tweet'][] = []
	let media_data: components['schemas']['Media'][] = []

	let user_data_map: Map<string, components['schemas']['User']>
	let referenced_tweets_data_map: Map<string, components['schemas']['Tweet']>
	let media_data_map: Map<string, components['schemas']['Media']>

	let is_loading = false

	async function fetch_status(): Promise<void> {
		const tweets = await fetch('/api/status/' + $page.params.id)

		if (tweets.status !== 200) {
			console.log(tweets.body)
			return
		}

		const home_data = await tweets.json()

		tweets_data = home_data.data
		users_data = home_data.includes.users ?? []
		referenced_tweets_data = home_data.includes.tweets ?? []
		media_data = home_data.includes.media ?? []

		if (tweets_data.length === 0) return

		console.log(tweets_data.length)

		user_data_map = Util.to_map_by_id(users_data)
		referenced_tweets_data_map = Util.to_map_by_id(referenced_tweets_data)
		media_data_map = Util.to_map_by_media_key(media_data)

		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		tweet_data = tweets_data[0]!
	}

	onMount(async () => {
		if (tweets_data.length === 0) {
			is_loading = true
			await fetch_status()
			is_loading = false
		}
	})
</script>

<svelte:head>
	<title>Home / Twitter App</title>
</svelte:head>

<div class="flex_row gap_border root_container">
	<div />
	<div class="center_container">
		<div class="header">
			<div class="flex_row align_items_center header_row">
				<div class="header_icon tap_area_container">
					<div class="tap_area" on:click={() => history.back()} on:keydown />
					<LeftArrow />
				</div>
				ツイート
			</div>
		</div>

		{#if is_loading}
			<div style="padding: 16px; display: flex; justify-content: center">
				<Loading />
			</div>
		{/if}
		{#if tweet_data}
			{@const tweet = new Tweet(tweet_data, user_data_map, referenced_tweets_data_map, media_data_map)}
			<div class="element">
				{#if tweet.is_retweet}
					<div class="flex_row align_items_center retweet_row">
						<div class="avatar_above"><div class="retweet_icon"><RetweetSmall /></div></div>
						{tweet.retweet_user_name}さんがリツイートしました
					</div>
				{/if}
				<div class="flex_column tweet_element">
					<div class="flex_row align_items_center avatar_row">
						<div class="avatar_container">
							<a href={tweet.profile_url}>
								<img class="avatar_icon" src={tweet.profile_image_url} alt="avatar" />
							</a>
						</div>
						<div class="flex_row username_row">
							<div class="flex_column">
								<div class="name overflow_ellipsis">
									<a href={tweet.profile_url}>{tweet.name}</a>
								</div>
								<div class="username overflow_ellipsis">
									<a href={tweet.profile_url}>@{tweet.username}</a>
								</div>
							</div>
							<div class="flex_auto" />
							<div class="three_dot_icon tap_area_container">
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
							<div class="media_frame flex_row">
								<img alt="画像" src={tweet.media_url_0} class="media" />
							</div>
						{:else if tweet.media_count === 2}
							<div class="media_frame flex_column media_column media_frame_tile">
								<div class="flex_row media_row">
									<div class="media_cell">
										<img alt="画像" src={tweet.media_url_0} class="media" />
									</div>
									<div class="media_cell">
										<img alt="画像" src={tweet.media_url_1} class="media" />
									</div>
								</div>
							</div>
						{:else if tweet.media_count === 3}
							<div class="media_frame flex_row media_row media_frame_tile">
								<div class="media_cell">
									<img alt="画像" src={tweet.media_url_0} class="media" />
								</div>
								<div class="flex_column media_column">
									<div class="media_cell">
										<img alt="画像" src={tweet.media_url_1} class="media" />
									</div>
									<div class="media_cell">
										<img alt="画像" src={tweet.media_url_2} class="media" />
									</div>
								</div>
							</div>
						{:else if tweet.media_count === 4}
							<div class="media_frame flex_column media_column media_frame_tile">
								<div class="flex_row media_row">
									<div class="media_cell">
										<img alt="画像" src={tweet.media_url_0} class="media" />
									</div>
									<div class="media_cell">
										<img alt="画像" src={tweet.media_url_1} class="media" />
									</div>
								</div>
								<div class="flex_row media_row">
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
							<div class="action_icon tap_area_container">
								<div class="tap_area" />
								<Reply />
							</div>
						</div>
						<div class="action">
							<div class="action_icon tap_area_container">
								<div class="tap_area" />
								<Retweet />
							</div>
						</div>
						<div class="action">
							<div class="action_icon tap_area_container">
								<div class="tap_area" />
								<Like />
							</div>
						</div>
						<div class="action">
							<div class="action_icon">
								<div class="tap_area tap_area_container" />
								<UpArrow />
							</div>
						</div>
					</div>
					<div />
				</div>
			</div>
		{/if}
	</div>
	<div />
</div>

<style>
	.element {
		padding: 16px;
		border-bottom: 1px solid var(--border-color);
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.avatar_above {
		min-width: 48px;
		display: flex;
		align-items: center;
		justify-content: flex-end;
	}

	.tweet_element {
		gap: 12px;
	}

	.avatar_row {
		gap: 12px;
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
		min-width: 0;
		overflow-wrap: break-word;
	}

	.username_row {
		gap: 4px;
		align-items: center;
		flex: auto;

		font-weight: 400;
		font-size: 15px;
		line-height: 20px;
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

	.action_row {
		color: var(--gray-color);
		font-size: 13px;
		line-height: 16px;
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
		margin: 0 auto;
		fill: var(--gray-color);
	}
</style>
