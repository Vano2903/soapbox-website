// made with love by github.com/branila
// https://github.com/branila/bea/blob/3f70dcfb23e5a31edf64308bb260eb0b6b53b929/src/lib/utils/goCatch.ts

// edit: i swapped the error and the data return to make it more golang like

/**
 * Handles a promise and captures errors, returning the error or the result in a tuple.
 *
 * This utility function helps manage promises by avoiding the need for try-catch blocks.
 * It captures errors and returns them in a consistent format, optionally filtering
 * for specific error types. Unexpected errors can be re-thrown.
 *
 * @template T - The type of the resolved value of the promise.
 * @template E - The type of the error class to catch, extending the `Error` class.
 *
 * @param {Promise<T>} promise - The promise to handle.
 * @param {E[] | E} [errorsToCatch] - An optional value that can be either a single error constructor
 * or an array of error constructors. If provided, only errors matching these constructors will be captured.
 * Other errors are re-thrown.
 *
 * @returns {Promise<[T, undefined] | [undefined, InstanceType<E>]>} A promise that resolves to a tuple.
 * - `[T, undefined]` if the promise resolves successfully.
 * - `[undefined, InstanceType<E>]` if the promise is rejected with an error matching `errorsToCatch`.
 *
 * @throws If the promise is rejected with an error not listed in `errorsToCatch`, the error is re-thrown.
 *
 * @example
 * const [data, error] = await goCatch(promise)
 * if (error) {
 *   console.error('An error occurred:', error)
 * }
 */
export default async function goCatch<T, E extends new (message?: string) => Error>(
	promise: Promise<T>,
	errorsToCatch?: E[] | E
): Promise<[T, undefined] | [undefined, InstanceType<E>]> {
	try {
		const data = await promise;

		// If the promise resolves successfully, return the data
		return [data, undefined] as [T, undefined];
	} catch (error) {
		if (!errorsToCatch) {
			// If no error types are provided, return the error
			return [undefined, error] as [undefined, InstanceType<E>];
		}

		// If a single error type is provided, convert it to an array
		if (!Array.isArray(errorsToCatch)) {
			errorsToCatch = [errorsToCatch];
		}

		// If the error matches one of the provided error types, return the error
		if (Array.isArray(errorsToCatch) && errorsToCatch.some((E) => error instanceof E)) {
			return [undefined, error] as [undefined, InstanceType<E>];
		}

		// If the error does not match any of the provided error types, re-throw the error
		throw error;
	}
}