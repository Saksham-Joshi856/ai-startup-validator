/**
 * Utility function to add timeout to fetch calls
 * Returns a promise that rejects if the API takes longer than the timeout
 */
export function createTimeoutPromise<T>(
    promise: Promise<T>,
    timeoutMs: number
): Promise<T & { isTimeout?: boolean }> {
    return Promise.race([
        promise,
        new Promise<T & { isTimeout?: boolean }>((_, reject) =>
            setTimeout(
                () => reject(new Error("API_TIMEOUT")),
                timeoutMs
            )
        ),
    ]);
}

/**
 * Detects if an error is a timeout error
 */
export function isTimeoutError(error: unknown): boolean {
    if (error instanceof Error) {
        return error.message === "API_TIMEOUT" || error.message.includes("timeout");
    }
    return false;
}
