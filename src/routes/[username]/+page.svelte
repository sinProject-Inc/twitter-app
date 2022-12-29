<script lang="ts">
	import { page } from '$app/stores'
	import { onMount } from 'svelte'
	import type { components } from 'twitter-api-sdk/dist/types'
	import Loading from '$lib/icons/loading.svelte'
	import '../app.css'
	import LeftArrow from '$lib/icons/left_arrow.svelte'
	import ThreeDot from '$lib/icons/three_dot.svelte'
	import LocationPin from '$lib/icons/location_pin.svelte'
	import Link from '$lib/icons/link.svelte'
	import Calendar from '$lib/icons/calendar.svelte'
	import TweetList from '$lib/components/tweet_list.svelte'

	let user_data: components['schemas']['User']
	let is_loading = false

	async function fetch_profile(): Promise<void> {
		const user = await fetch(`/api/user/${$page.params.username}`)
		if (user.status !== 200) {
			console.log(user.body)
			return
		}

		const response = await user.json()
		user_data = response.data

		console.log(user_data)
	}

	onMount(async () => {
		is_loading = true
		await fetch_profile()
		is_loading = false
	})
</script>

{#if is_loading}
	<div style="padding: 16px; display: flex; justify-content: center">
		<Loading />
	</div>
{/if}
{#if user_data}
	<div class="gap_border root_container">
		<div class="center_container">
			<div class="header header_items_container">
				<div class="header_pic_container">
					<LeftArrow />
				</div>
				<div class="header_text_container">
					<div class="header_name">{user_data.name}</div>
					<div class="header_tweet_count">{user_data.public_metrics?.tweet_count} 件のツイート</div>
				</div>
			</div>
			<div class="banner_container" />
			<div class="profile_container">
				{#if user_data.profile_image_url}
					<img
						class="pic_container"
						alt="Profile"
						src={user_data.profile_image_url.replace('_normal', '_400x400')}
					/>
				{/if}
				<div class="buttons_container">
					<div class="more_button">
						<ThreeDot />
					</div>
					<div class="follow_button ">フォロー</div>
				</div>
				<div class="name_container">
					<div class="name">{user_data.name}</div>
					<div class="username">@{user_data.username}</div>
				</div>
				<div class="bio">
					{#if user_data.description}
						{@html user_data.description
							.replace(/\n/g, '<br>')
							.replace(/\B#\w*[a-zA-Z]+\w*/gi, '<span class="hashtag">$&</span>')}
					{/if}
				</div>
				<div class="description">
					<div class="description_row_container">
						{#if user_data.location}
							<div class="description_item_container">
								<div class="description_item_icon">
									<LocationPin />
								</div>
								<div>{user_data.location}</div>
							</div>
						{/if}
						{#if user_data.entities?.url?.urls}
							<div class="description_item_container">
								<div class="description_item_icon">
									<Link />
								</div>
								<div>
									<a target="_blank" rel="noreferrer" href={user_data.entities?.url?.urls[0]?.url}
										>{user_data.entities?.url?.urls[0]?.display_url}</a
									>
								</div>
							</div>
						{/if}
					</div>
					<div class="description_item_container">
						<div class="description_item_icon">
							<Calendar />
						</div>
						<div>2009年3月からTwitterを利用しています</div>
					</div>
				</div>
				<div class="follow_details_container">
					<div>
						<block class="follow_details_header">{user_data.public_metrics?.following_count}</block
						>フォロー中
					</div>
					<div>
						<block class="follow_details_header">{user_data.public_metrics?.followers_count}</block
						>フォロワー
					</div>
				</div>
				<div class="tab_container">
					<div class="selected_tab tab">
						<div />
						<div>ツイート</div>
						<div class="tab_underline selected_tab_underline" />
					</div>
					<div class="tab">
						<div />
						<div>ツイートと返信</div>
						<div class="tab_underline" />
					</div>
					<div class="tab">
						<div />
						<div>メディア</div>
						<div class="tab_underline" />
					</div>
					<div class="tab">
						<div />
						<div>いいね</div>
						<div class="tab_underline" />
					</div>
				</div>
			</div>
			<TweetList api_path="/api/user/{user_data.id}/tweets" />
		</div>
	</div>
{/if}

<style>
	.header {
		-webkit-position: sticky;
		position: sticky;
		z-index: 3;
		top: 0;
		height: 53px;
		backdrop-filter: blur(12px);
		background-color: rgba(255, 255, 255, 0.85);
		padding-left: 16px;
		padding-right: 16px;
		font-size: 22px;
		font-weight: 700;
	}

	.header_items_container {
		display: flex;
		padding-left: 0.5rem;
		padding-right: 0.5rem;
		align-items: center;
		gap: 1.5rem;
		height: 53px;
	}

	.header_pic_container {
		margin: 0.5rem;
		width: 1.25rem;
		height: 1.25rem;
		border-radius: 9999px;
	}

	.header_text_container {
		padding-top: 0.25rem;
		line-height: 1rem;
		flex-direction: column;
		justify-content: center;
	}

	.header_name {
		font-weight: 700;
		margin-bottom: 6px;
		font-size: 20px;
		color: rgb(15, 20, 25);
	}

	.header_tweet_count {
		font-size: 13.5px;
		color: rgb(83, 100, 113);
	}

	.banner_container {
		width: 100%;
		height: 200px;
	}

	.profile_container {
		border-bottom-width: 1px;
		padding-left: 16px;
		padding-right: 16px;
	}

	.pic_container {
		position: absolute;
		border-radius: 9999px;
		border-width: 4px;
		border-color: #ffffff;
		height: 140px;
		width: 140px;
		transform: translateY(-70px);
	}

	.buttons_container {
		display: flex;
		justify-content: flex-end;
		align-items: center;
		margin-bottom: 23px;
		padding-bottom: 12px;
		gap: 8px;
	}

	.more_button {
		border-radius: 9999px;
		border-width: 1px;
		height: 20px;
		width: 20px;
		padding: 7px;
		border: solid #cfd9dd;
	}

	.follow_button {
		color: #ffffff;
		font-weight: 700;
		background: rgb(15, 20, 25);
		font-size: 16px;
		border-radius: 26px;
		padding-left: 17.5px;
		padding-right: 17.5px;
		padding-top: 8px;
		padding-bottom: 8px;
	}

	.name_container {
		margin-bottom: 16px;
		line-height: 16px;
	}

	.name {
		font-size: 1.25rem;
		line-height: 1.75rem;
		font-weight: 800;
		color: rgb(15, 20, 26);
	}

	.username {
		color: 15px;
		color: rgb(83, 100, 113);
	}

	.bio {
		padding-bottom: 0.75rem;
		line-height: 1.25rem;
		color: 16px;
	}

	:global(.hashtag) {
		color: rgb(96 165 250);
	}

	.description {
		margin-bottom: 11px;
		color: rgb(83, 100, 113);
	}

	.description_row_container {
		display: flex;
		gap: 12px;
	}

	.description_item_container {
		display: flex;
		align-items: center;
		gap: 4px;
	}

	.description_item_icon {
		height: 19px;
		width: 19px;
		fill: rgb(83, 100, 113);
	}

	.follow_details_container {
		display: flex;
		margin-bottom: 0.5rem;
		gap: 1.25rem;
		color: 15px;
		color: rgb(83, 100, 113);
	}

	.follow_details_header {
		margin-right: 0.25rem;
		color: #000000;
		font-weight: 700;
	}

	.tab_container {
		display: flex;
		text-align: center;
		align-items: center;
		height: 3.5rem;
		color: rgb(83, 100, 113);
	}

	.tab {
		display: flex;
		padding-top: 0;
		padding-bottom: 0;
		font-size: 1.125rem;
		line-height: 1.75rem;
		flex-direction: column;
		justify-content: space-between;
		align-items: center;
		height: 100%;
		flex-grow: 1;
	}

	.selected_tab {
		color: black;
		font-weight: 700;
	}

	.selected_tab_underline {
		background-color: rgb(96 165 250);
	}

	.tab_underline {
		width: 75%;
		height: 0.25rem;
		border-radius: 0.375rem;
	}
</style>
