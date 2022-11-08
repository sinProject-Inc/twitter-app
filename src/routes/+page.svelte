<script lang="ts">
	import { page } from '$app/stores'

	console.log($page.data.user)

	function signInWithTwitter(): void {
		const form_element = document.getElementById('sign_in')

		if (form_element instanceof HTMLFormElement) {
			form_element.submit()
		}
	}
</script>

<h1>Welcome to Twitter App</h1>
<p>
	Visit <a href="https://github.com/sinProject-Inc/twitter-app">twitter-app</a> to read the documentation
</p>

<form method="POST" action="/sign_in" id="sign_in">
	<div class="sign_in" on:click={signInWithTwitter} on:keypress={signInWithTwitter}>
		<div class="flex_row_twitter">
			<img src="./twitter_social_icon_circle_blue.svg" alt="" width="20px" />
			<div>Sign in with Twitter</div>
		</div>
	</div>
</form>

<style>
	.sign_in {
		width: 238px;
		height: 40px;
		border: 1px solid #dadce0;
		border-radius: 4px;
		cursor: pointer;
	}

	.flex_row_twitter {
		height: 40px;
		display: flex;
		flex-direction: row;
		gap: 8px;
		align-items: center;
		padding: 0 8px;

		color: #3c4043;
		font-family: sans-serif;
		/* font-weight: 80; */
		font-size: 12px;
	}
</style>
