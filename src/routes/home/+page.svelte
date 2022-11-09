<script lang="ts">
	import type { PageData } from './$types'

	export let data: PageData

	console.log(data.tweets)

	const tweets = data.tweets.data || []
	const users = data.tweets.includes?.users || []
	const userMap = users.reduce((map, user) => {
		map.set(user.id, user)
		return map
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	}, new Map<string, any>())


	const timeline = tweets.map((tweet) => {
		return { tweet: tweet, user: userMap.get(tweet.author_id ?? '') }
	})
</script>

<svelte:head>
	<title>Home / Twitter App</title>
</svelte:head>

<form action="/sign_out" method="POST">
	<button type="submit">Log out</button>
</form>

<br />

<!-- {$page.data.user.twitter_id} -->

{#each timeline as timeline_item}
	<div class="element">
		<img class="avatar" src={timeline_item.user?.profile_image_url ?? ''} alt="profile" />
		<div class="text_column">
			<div class="username_row">
				<div class="name overflow_ellipsis">{timeline_item.user?.name}</div>
				<div class="username overflow_ellipsis">@{timeline_item.user?.username}</div>
				<div class="time">{timeline_item.tweet.created_at}</div>
			</div>
			{timeline_item.tweet.text}
		</div>
	</div>
{/each}

<style>
	:global(body) {
		font-family: "Segoe UI", Meiryo, system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
	}

	.element {
		padding: 8px;
		border-bottom: 1px solid #ccc;
		display: flex;
		flex-direction: row;
		gap: 8px;
	}

	.avatar {
		border-radius: 50%;
		width: 48px;
		height: 48px;
	}

	.text_column {
		display: flex;
		flex-direction: column;
		gap: 4px;
		min-width: 0;
	}

	.username_row {
		display: flex;
		flex-direction: row;
		gap: 8px;
		align-items: center;
	}

	.overflow_ellipsis {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.name {
		font-weight: bold;
	}

	.username {
		color: #666;
	}

	.time {
		color: #666;
		white-space: nowrap;
	}
</style>
