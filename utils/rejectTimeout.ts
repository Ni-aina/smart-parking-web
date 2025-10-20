export const rejectTimeout = (ms = 1000 * 30, message = "Request took too long"): Promise<never> => {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error(message || `Operation timed out after ${ms}ms`));
    }, ms)
  })
}