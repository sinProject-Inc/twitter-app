<script lang="ts">
	import TweetComponent from '$lib/components/tweet.svelte'
	import Loading from '$lib/icons/loading.svelte'
	import { TweetUtil } from '$lib/tweet_util'
	import { Util } from '$lib/util'
	import { onMount } from 'svelte'
	import type { components } from 'twitter-api-sdk/dist/types'
	import '../../routes/app.css'

	let tweets_data: components['schemas']['Tweet'][] = []
	let users_data: components['schemas']['User'][] = []
	let referenced_tweets_data: components['schemas']['Tweet'][] = []
	let media_data: components['schemas']['Media'][] = []

	export let api_path: string

	let user_data_map: Map<string, components['schemas']['User']>
	let referenced_tweets_data_map: Map<string, components['schemas']['Tweet']>
	let media_data_map: Map<string, components['schemas']['Media']>

	let is_loading = false

	async function fetch_data(api_path: string): Promise<void> {
		const tweets = await fetch(api_path)

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

		user_data_map = Util.to_map_by_id(users_data)
		referenced_tweets_data_map = Util.to_map_by_id(referenced_tweets_data)

		const missing_media_data = await TweetUtil.get_missing_media_data(
			tweets_data,
			user_data_map,
			referenced_tweets_data_map,
			media_data
		)

		media_data = media_data.concat(missing_media_data)

		media_data_map = Util.to_map_by_media_key(media_data)
	}

	onMount(async () => {
		if (tweets_data.length === 0) {
			is_loading = true
			await fetch_data(api_path)
			is_loading = false
		}
	})
</script>

{#if is_loading}
	<div style="padding: 16px; display: flex; justify-content: center">
		<Loading />
	</div>
{:else}
	<div class="flex_column gap_border">
		{#each tweets_data as tweet_data}
			<TweetComponent {tweet_data} {user_data_map} {referenced_tweets_data_map} {media_data_map} />
		{/each}
	</div>
{/if}
