// Mock transport. When the backend exists, replace `mock()` calls in the api/*.js files with
// fetch() calls; pages and hooks only depend on these async functions.
const MOCK_DELAY_MS = 0;

export const mock = (value) =>
  new Promise((resolve) => setTimeout(() => resolve(structuredClone(value)), MOCK_DELAY_MS));

export class ApiError extends Error {
  constructor(message, status = 500) { super(message); this.status = status; }
}
