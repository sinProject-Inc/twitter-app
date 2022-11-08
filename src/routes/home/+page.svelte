<script lang="ts">
	import { page } from '$app/stores'
	import type { PageData } from './$types'

	export let data: PageData

	console.log(data.tweets)

	const tweets = data.tweets.data || []
</script>

<svelte:head>
	<title>Home / Twitter App</title>
</svelte:head>

<form action="/sign_out" method="POST">
	<button type="submit">Log out</button>
</form>

{$page.data.user.twitter_id}

{#each tweets as tweet}
	<div>
		{tweet.text}
	</div>
{/each}

{data.tweets}


