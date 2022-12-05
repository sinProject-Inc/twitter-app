import type { components } from 'twitter-api-sdk/dist/types'
import { Tweet } from "$lib/tweet"
import { Util } from "$lib/util"

export class TweetUtil {
 	public static async get_missing_media_data(
	tweets_data: components['schemas']['Tweet'][],  
	user_data_map: Map<string, components['schemas']['User']>, 
	referenced_tweets_data_map: Map<string, components['schemas']['Tweet']>, 
	media_data: components['schemas']['Media'][]
	): Promise<components['schemas']['Media'][]> {
		const media_data_map = Util.to_map_by_media_key(media_data)

		const tweet_ids_without_media_data = []

		for (const tweet_data of tweets_data) {
			const tweet = new Tweet(
				tweet_data,
				user_data_map,
				referenced_tweets_data_map,
				media_data_map
			)

			if (!tweet.media_data_exists) {
				tweet_ids_without_media_data.push(tweet.target_tweet_id)
			}
		}

		if (tweet_ids_without_media_data.length > 0) {
			const response = await fetch(`/api/status/${tweet_ids_without_media_data}`)
			const missing_media_data = await response.json()
			return missing_media_data.includes.media
		}
		
		return []
	}
}