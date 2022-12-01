export class Util {
	public static to_map_by_id<T extends { id: string }>(data: T[]): Map<string, T> {
		const map = new Map<string, T>()

		for (const item of data) {
			map.set(item.id, item)
		}

		return map
	}

	public static to_map_by_media_key<T extends { media_key?: string }>(data: T[]): Map<string, T> {
		const map = new Map<string, T>()

		for (const item of data) {
			map.set(item.media_key ?? '', item)
		}

		return map
	}
}