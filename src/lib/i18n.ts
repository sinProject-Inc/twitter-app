import { browser } from '$app/environment'
import { register, init } from 'svelte-i18n'

const defaultLocale = 'en'

register('en', () => import('../locales/en.json'))
register('ja', () => import('../locales/ja.json'))

function get_initial_locale(): string {
	if (!browser) return defaultLocale

	const current_locale = localStorage.getItem('locale') || window.navigator.language
	const lang = current_locale.split('-')[0] ?? defaultLocale

	return lang
}

init({
	fallbackLocale: defaultLocale,
	initialLocale: get_initial_locale(),
})
