<script lang="ts">
	import ThreeDot from '$lib/icons/three_dot.svelte'
	import { _, locale, locales } from 'svelte-i18n'
	import '../app.css'
	import TweetList from '$lib/components/tweet_list.svelte'

	export let post_hint_element: HTMLElement
	export let post_element: HTMLElement

	function on_input_post_tweet(): void {
		const exists_post_tweet_text = post_element.innerText !== ''

		console.log(post_element.innerText.length)
		console.log('"' + post_element.innerText + '"')

		post_hint_element.style.visibility = exists_post_tweet_text ? 'hidden' : 'visible'
	}

	function save_locale(): void {
		localStorage.setItem('locale', $locale ?? '')
	}

	console.log($locale)
</script>

<svelte:head>
	<title>{$_('latest_tweets')} / Twitter App</title>
</svelte:head>

<form action="/sign_out" method="POST">
	<button type="submit">{$_('sign_out')}</button>
</form>

<select bind:value={$locale} on:change={save_locale}>
	{#each $locales as locale}
		<option value={locale}>{locale}</option>
	{/each}
</select>

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
				{$_('latest_tweets')}
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
						<div class="post_hint" bind:this={post_hint_element}>{$_('whats_happening')}</div>
						<div
							class="post_element"
							bind:this={post_element}
							on:input={on_input_post_tweet}
							contenteditable="true"
						/>
					</div>
					<div class="flex_row align_items_center padding_top_16">
						<div class="flex_auto" />
						<a href="/api/post" class="button">{$_('do_tweet')}</a>
					</div>
				</div>
			</div>

			<TweetList api_path="/api/home" />
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
</style>
