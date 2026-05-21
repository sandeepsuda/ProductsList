interface AuthenticatedFetchOptions extends RequestInit {
  onUnauthorized?: () => void | Promise<void>;
}

let refreshPromise: Promise<Response> | null = null;

export const authenticatedFetch = async (
  input: RequestInfo | URL,
  options: AuthenticatedFetchOptions = {},
): Promise<Response> => {
  const { onUnauthorized, ...requestInit } = options;

  const executeRequest = () =>
    fetch(input, {
      ...requestInit,
      credentials: 'include',
    });

  let response = await executeRequest();

  if (response.status !== 401) {
    return response;
  }

  const refreshResponse = await (
    refreshPromise ??
    (refreshPromise = (async () => {
      try {
        return await fetch('/api/refresh', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });
      } finally {
        refreshPromise = null;
      }
    })())
  );

  if (refreshResponse.ok) {
    response = await executeRequest();
  }

  if (response.status === 401 && onUnauthorized) {
    await onUnauthorized();
  }

  return response;
};
