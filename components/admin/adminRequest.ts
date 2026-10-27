export async function adminRequest<T>(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<T> {
  const response = await fetch(input, {
    ...init,
    cache: init?.cache ?? "no-store",
  });
  const result = await response.json() as T & { error?: unknown };

  if (!response.ok) {
    const message = typeof result.error === "string" ? result.error : "Admin request failed";
    throw new Error(message);
  }

  return result;
}
