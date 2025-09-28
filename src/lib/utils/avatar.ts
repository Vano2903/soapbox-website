export function createAvatarUrl(nick: string, size?: 'small' | 'medium' | 'big'): string {
	let url = 'https://avatar.iran.liara.run/username';
	url += `?username=${nick}`;
	if (size) {
		switch (size) {
			case 'small':
				url += `&size=${64}`;
				break;
			case 'medium':
				url += `&size=${128}`;
				break;
			case 'big':
				url += `&size=${256}`;
				break;
		}
	}
	return url;
}
