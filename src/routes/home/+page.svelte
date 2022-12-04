<script lang="ts">
	import Like from '$lib/icons/like.svelte'
	import Loading from '$lib/icons/loading.svelte'
	import Reply from '$lib/icons/reply.svelte'
	import Retweet from '$lib/icons/retweet.svelte'
	import RetweetSmall from '$lib/icons/retweet_small.svelte'
	import ThreeDot from '$lib/icons/three_dot.svelte'
	import UpArrow from '$lib/icons/up_arrow.svelte'
	import { Tweet } from '$lib/tweet'
	import { Util } from '$lib/util'
	import { onMount } from 'svelte'
	import type { components } from 'twitter-api-sdk/dist/types'
	import '../app.css'

	export let post_hint_element: HTMLElement
	export let post_element: HTMLElement

	let tweets_data: components['schemas']['Tweet'][] = []
	let users_data: components['schemas']['User'][] = []
	let referenced_tweets_data: components['schemas']['Tweet'][] = []
	let media_data: components['schemas']['Media'][] = []

	let user_data_map: Map<string, components['schemas']['User']>
	let referenced_tweets_data_map: Map<string, components['schemas']['Tweet']>
	let media_data_map: Map<string, components['schemas']['Media']>

	let is_loading = false

	async function fetch_home(): Promise<void> {
		const tweets = await fetch('/api/home')

		if (tweets.status !== 200) {
			console.log(tweets.body)
			return
		}

		const home_data = await tweets.json()

		tweets_data = home_data.data
		users_data = home_data.includes.users ?? []
		referenced_tweets_data = home_data.includes.tweets ?? []
		media_data = home_data.includes.media ?? []

		console.log(tweets_data.length)

		// console.log('home_data', home_data)
		// console.log('tweets_data', tweets_data)
		// console.log('referenced_tweets_data', referenced_tweets_data)
		// console.log('media_data', media_data)

		user_data_map = Util.to_map_by_id(users_data)
		referenced_tweets_data_map = Util.to_map_by_id(referenced_tweets_data)

		await add_missing_media_data()

		media_data_map = Util.to_map_by_media_key(media_data)
	}

	function on_click_tweet(tweet: Tweet): void {
		const selection = window.getSelection()

		if (selection?.isCollapsed) {
			location.href = tweet.status_url
		}
	}

	function on_input_post_tweet(): void {
		const exists_post_tweet_text = post_element.innerText !== ''

		console.log(post_element.innerText.length)
		console.log('"' + post_element.innerText + '"')

		post_hint_element.style.visibility = exists_post_tweet_text ? 'hidden' : 'visible'
	}

	async function add_missing_media_data(): Promise<void> {
		const temp_media_data_map = Util.to_map_by_media_key(media_data)

		const tweet_ids_without_media_data = []

		for (const tweet_data of tweets_data) {
			const tweet = new Tweet(
				tweet_data,
				user_data_map,
				referenced_tweets_data_map,
				temp_media_data_map
			)

			if (!tweet.media_data_exists) {
				tweet_ids_without_media_data.push(tweet.target_tweet_id)
			}
		}

		if (tweet_ids_without_media_data.length > 0) {
			const response = await fetch(`/api/status/${tweet_ids_without_media_data}`)
			const missing_media_data = await response.json()
			media_data = media_data.concat(missing_media_data.includes.media)
		}
	}

	onMount(async () => {
		if (tweets_data.length === 0) {
			is_loading = true
			await fetch_home()
			is_loading = false
		}
	})
</script>

<svelte:head>
	<title>Home / Twitter App</title>
</svelte:head>

<form action="/sign_out" method="POST">
	<button type="submit">Sign out</button>
</form>

<br />

<div class="flex_row gap_border root_container">
	<div />
	<div class="center_container">
		<div class="header">
			<div class="flex_row align_items_center header_row">
				<div class="header_icon tap_area_container">
					<img
						src="/images/sinProject-07.png"
						alt="ロゴ"
						width="100%"
						style="position: absolute; top: 2px;"
					/>
				</div>
				最新ツイート
				<div class="flex_auto" />
				<div class="header_icon tap_area_container">
					<div class="tap_area" />
					<ThreeDot />
				</div>
			</div>
		</div>

		<div class="flex_column gap_border">
			<div class="flex_row post_container">
				<div class="avatar_container">
					<img
						class="avatar_icon"
						src="https://pbs.twimg.com/profile_images/1412275348805349376/J5YrITSD_x96.jpg"
						alt="avatar"
					/>
				</div>
				<div class="flex_auto flex_column gap_border">
					<div class="post_body_container">
						<div class="post_hint" bind:this={post_hint_element}>いまどうしてる？</div>
						<div
							class="post_element"
							bind:this={post_element}
							on:input={on_input_post_tweet}
							contenteditable="true"
						/>
					</div>
					<div class="flex_row align_items_center padding_top_16">
						<div class="flex_auto" />
						<a href="/api/post" class="button">ツイートする</a>
					</div>
				</div>
			</div>

			{#if is_loading}
				<div style="padding: 16px; display: flex; justify-content: center">
					<Loading />
				</div>
			{:else}
				<div class="flex_column gap_border">
					{#each tweets_data as tweet_data}
						{@const tweet = new Tweet(
							tweet_data,
							user_data_map,
							referenced_tweets_data_map,
							media_data_map
						)}
						<div
							class="flex_column tweet_container"
							on:click={() => on_click_tweet(tweet)}
							on:keypress
						>
							{#if tweet.is_retweet}
								<div class="flex_row align_items_center retweet_row">
									<div class="flex_row align_items_center avatar_above">
										<div class="retweet_icon"><RetweetSmall /></div>
									</div>
									{tweet.retweet_user_name}さんがリツイートしました
								</div>
							{/if}
							<div class="flex_row tweet_element">
								<div class="avatar_container">
									<a href={tweet.profile_url}>
										<img class="avatar_icon" src={tweet.profile_image_url} alt="avatar" />
									</a>
								</div>
								<div class="flex_column tweet_body">
									<div class="flex_column text_column">
										<div class="flex_row username_row">
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
											<div class="flex_auto" />
											<div class="action_icon tap_area_container">
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
										<div class="media_frame media_row media_frame_tile">
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

									<div class="flex_row align_items_center action_row">
										<div class="flex_row align_items_center action">
											<div class="action_icon tap_area_container">
												<div class="tap_area" />
												<Reply />
											</div>
											<div class="icon_text overflow_ellipsis">{tweet.reply_count}</div>
										</div>
										<div class="flex_row align_items_center action">
											<div class="action_icon tap_area_container">
												<div class="tap_area" />
												<Retweet />
											</div>
											<div class="icon_text overflow_ellipsis">{tweet.retweet_count}</div>
										</div>
										<div class="flex_row align_items_center action">
											<div class="action_icon tap_area_container">
												<div class="tap_area" />
												<Like />
											</div>
											<div class="icon_text overflow_ellipsis">{tweet.like_count}</div>
										</div>
										<div class="flex_row align_items_center action_up_arrow">
											<div class="action_icon tap_area_container">
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
			{/if}
		</div>
	</div>
	<div />
</div>

<style>
	.post_container {
		padding: 16px;
		gap: 12px;
	}

	.padding_top_16 {
		padding-top: 16px;
	}

	.post_body_container {
		flex: auto;
		position: relative;
		font-size: 20px;
		line-height: 24px;
		padding-bottom: 16px;
	}

	.post_hint {
		position: absolute;
		color: #536471;
		/* user-select: none; */
	}

	.post_element {
		position: relative;
	}

	.tweet_container {
		padding: 16px;
		gap: 6px;
		cursor: pointer;
	}

	.tweet_container:hover {
		transition: 0.2s;
		background-color: rgb(245, 248, 250);
	}

	.avatar_above {
		min-width: 48px;
		justify-content: flex-end;
	}

	.tweet_element {
		gap: 12px;
	}

	.tweet_body {
		gap: 12px;
		min-width: 0;
		flex: auto;

		font-size: 16px;
		line-height: 20px;
		font-weight: 400;
	}

	.text_column {
		gap: 8px;
		min-width: 0;
		overflow-wrap: break-word;
	}

	.username_row {
		gap: 4px;

		font-weight: 400;
		font-size: 15px;
		line-height: 20px;
	}

	.time {
		white-space: nowrap;
	}

	.time a {
		color: var(--gray-color);
	}

	.action_row {
		gap: 10px;

		color: var(--gray-color);
		font-size: 13px;
		line-height: 16px;
	}

	.action {
		gap: 10px;
		flex: 1;
	}

	.action_up_arrow {
		flex: 0;
	}

	.icon_text {
		font-size: 14px;
	}

	.action_icon {
		width: 17.5px;
		height: 17.5px;
		fill: var(--gray-color);
	}
</style>
