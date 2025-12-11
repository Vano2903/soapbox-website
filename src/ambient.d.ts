declare module '*&as=picture' {
	import type { Picture } from 'vite-imagetools';
	const value: Picture;
	export default value;
}

declare module '*?enhanced' {
	const value: any;
	export default value;
}

declare module '*&w=*' {
	const value: any;
	export default value;
}

declare module '*?w=*' {
	const value: any;
	export default value;
}
