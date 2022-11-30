import { redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import { TWITTER_CLIENT_ID } from '$env/static/private'

console.log('TWITTER_CLIENT_ID', TWITTER_CLIENT_ID)

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user) throw redirect(302, '/home')
}
