import { useEffect, useState } from 'react';

// Tiny SWR-style hook: requests with the same key share one in-flight promise and its cached
// result (rule client-swr-dedup), so two components asking for the same data fetch once.
const cache = new Map();

export function invalidate(prefix) {
  for (const key of cache.keys()) if (key.startsWith(prefix)) cache.delete(key);
}

export function useApi(key, fetcher) {
  const [state, setState] = useState(() => {
    const hit = cache.get(key);
    return hit?.data !== undefined ? { data: hit.data, error: null, loading: false } : { data: undefined, error: null, loading: true };
  });

  useEffect(() => {
    let alive = true;
    let entry = cache.get(key);
    if (!entry) {
      entry = { promise: fetcher() };
      entry.promise.then((data) => { entry.data = data; }, () => cache.delete(key));
      cache.set(key, entry);
    }
    if (entry.data !== undefined) {
      setState({ data: entry.data, error: null, loading: false });
    } else {
      setState((s) => (s.loading ? s : { ...s, loading: true }));
      entry.promise.then(
        (data) => alive && setState({ data, error: null, loading: false }),
        (error) => alive && setState({ data: undefined, error, loading: false }),
      );
    }
    return () => { alive = false; };
    // fetcher identity is irrelevant: the key fully describes the request
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return state;
}
