/**
 * Client-side fetch wrapper that automatically includes the auth token from localStorage.
 */
export async function apiFetch(input: string | URL | Request, init?: RequestInit): Promise<Response> {
  const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
  
  let headers: Headers;
  
  if (input instanceof Request) {
    headers = new Headers(input.headers);
  } else {
    headers = new Headers(init?.headers || {});
  }
  
  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  
  if (input instanceof Request) {
    // Re-create the request with new headers
    const newRequest = new Request(input, { headers });
    return fetch(newRequest, init);
  }
  
  const modifiedInit: RequestInit = {
    ...init,
    headers,
  };
  
  return fetch(input, modifiedInit);
}
