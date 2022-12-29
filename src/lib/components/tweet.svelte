<script lang="ts">
	import Like from '$lib/icons/like.svelte'
	import Reply from '$lib/icons/reply.svelte'
	import Retweet from '$lib/icons/retweet.svelte'
	import RetweetSmall from '$lib/icons/retweet_small.svelte'
	import ThreeDot from '$lib/icons/three_dot.svelte'
	import UpArrow from '$lib/icons/up_arrow.svelte'
	import { Tweet } from '$lib/tweet'
	import type { components } from 'twitter-api-sdk/dist/types'
	import { _ } from 'svelte-i18n'

	export let tweet_data: components['schemas']['Tweet']
	export let user_data_map: Map<string, components['schemas']['User']>
	export let referenced_tweets_data_map: Map<string, components['schemas']['Tweet']>
	export let media_data_map: Map<string, components['schemas']['Media']>

	let tweet: Tweet = new Tweet(
		tweet_data,
		user_data_map,
		referenced_tweets_data_map,
		media_data_map
	)

	function on_click_tweet(tweet: Tweet): void {
		const selection = window.getSelection()

		if (selection?.isCollapsed) {
			location.href = tweet.status_url
		}
	}
</script>

<div class="flex_column tweet_container" on:click={() => on_click_tweet(tweet)} on:keypress>
	{#if tweet.is_retweet}
		<div class="flex_row align_items_center retweet_row">
			<div class="flex_row align_items_center avatar_above">
				<div class="retweet_icon"><RetweetSmall /></div>
			</div>
			{$_('name_retweeted', {
				values: { name: tweet.retweet_user_name },
			})}
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

<style>
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
