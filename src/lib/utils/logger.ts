/**
 * Scoped logger with timestamps and structured context.
 *
 * Usage:
 * ```ts
 * const log = createLogger('homepage:load');
 * log.info('championship loaded', { name: championship.name, events: 5 });
 * // [2026-07-03T10:15:02.123Z] [INFO] [homepage:load] championship loaded { name: '2026', events: 5 }
 * log.error('no ongoing championship found', err);
 * ```
 *
 * `debug` only prints outside production builds, so it can stay verbose.
 */

type LogContext = unknown;

export interface Logger {
	debug: (message: string, ...context: LogContext[]) => void;
	info: (message: string, ...context: LogContext[]) => void;
	warn: (message: string, ...context: LogContext[]) => void;
	error: (message: string, ...context: LogContext[]) => void;
	/** Derive a narrower logger, e.g. createLogger('homepage').child('nextEvent'). */
	child: (subScope: string) => Logger;
}

const isDev = import.meta.env?.DEV ?? true;

function line(level: string, scope: string, message: string): string {
	return `[${new Date().toISOString()}] [${level}] [${scope}] ${message}`;
}

export function createLogger(scope: string): Logger {
	return {
		debug: (message, ...context) => {
			if (isDev) console.debug(line('DEBUG', scope, message), ...context);
		},
		info: (message, ...context) => {
			console.info(line('INFO', scope, message), ...context);
		},
		warn: (message, ...context) => {
			console.warn(line('WARN', scope, message), ...context);
		},
		error: (message, ...context) => {
			console.error(line('ERROR', scope, message), ...context);
		},
		child: (subScope) => createLogger(`${scope}:${subScope}`)
	};
}
