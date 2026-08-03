import { readFileSync, writeFileSync } from 'node:fs';
import { NICK_FILE } from './credentials';

export function saveNick(nick: string) {
	writeFileSync(NICK_FILE, JSON.stringify({ nick }), 'utf8');
}

export function readNick(): string {
	const raw = readFileSync(NICK_FILE, 'utf8');
	return (JSON.parse(raw) as { nick: string }).nick;
}
