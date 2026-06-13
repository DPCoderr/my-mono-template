const defaultApiBaseUrl = "http://localhost:5157";

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function apiRequest<TResponse>(
  path: string,
  init?: RequestInit,
): Promise<TResponse> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? defaultApiBaseUrl;
  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  if (!response.ok) {
    const details = await readJson(response);
    throw new ApiError(getErrorMessage(details, response.statusText), response.status, details);
  }

  return (await response.json()) as TResponse;
}

async function readJson(response: Response) {
  const text = await response.text();

  if (!text) {
    return undefined;
  }

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
}

function getErrorMessage(details: unknown, fallback: string) {
  if (
    details &&
    typeof details === "object" &&
    "title" in details &&
    typeof details.title === "string"
  ) {
    return details.title;
  }

  return fallback || "Request failed";
}
