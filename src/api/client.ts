import type { ApiErrorShape } from "@/i18n/types";

const TOKEN_STORAGE_KEY = "portateka_token";

type TokenListener = () => void;
const tokenListeners = new Set<TokenListener>();

export function getAuthToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function setAuthToken(token: string | null): void {
  try {
    if (token) {
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    }
  } catch {
    // Ignore storage access errors
  }

  for (const listener of tokenListeners) {
    listener();
  }
}

export function subscribeAuthToken(listener: TokenListener): () => void {
  tokenListeners.add(listener);

  const handleStorage = (event: StorageEvent) => {
    if (event.key === TOKEN_STORAGE_KEY) {
      listener();
    }
  };

  window.addEventListener("storage", handleStorage);

  return () => {
    tokenListeners.delete(listener);
    window.removeEventListener("storage", handleStorage);
  };
}

export class ApiClientError extends Error implements ApiErrorShape {
  public readonly status: number;
  public readonly code: string;
  public readonly resource?: string;
  public readonly params?: Record<string, string>;

  constructor(init: {
    status: number;
    code: string;
    resource?: string;
    params?: Record<string, string>;
  }) {
    super(init.code);
    this.name = "ApiClientError";
    this.status = init.status;
    this.code = init.code;
    this.resource = init.resource;
    this.params = init.params;
  }

  /**
   * Returns true if this error carries field-specific validation codes
   * intended to be rendered inline next to form inputs.
   */
  public hasFieldValidationParams(): boolean {
    if (!this.params || Object.keys(this.params).length === 0) {
      return false;
    }
    return (
      this.code === "VALIDATION_ERROR" ||
      this.code === "ALREADY_EXISTS" ||
      this.code === "FORBIDDEN"
    );
  }
}

export function isApiClientError(err: unknown): err is ApiClientError {
  return err instanceof ApiClientError;
}

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? "").replace(
  /\/+$/,
  "",
);

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}

export interface ApiRequestOptions {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  params?: Record<string, string | number | undefined>;
  authenticated?: boolean;
  signal?: AbortSignal;
}

interface SuccessEnvelope<T> {
  data: T;
}

interface ErrorEnvelope {
  code?: string;
  resource?: string;
  params?: Record<string, string>;
}

function buildRequestUrl(
  path: string,
  params?: Record<string, string | number | undefined>,
): string {
  const base = `${API_BASE_URL}${path}`;
  if (!params) {
    return base;
  }

  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) {
      searchParams.set(key, String(value));
    }
  }

  const queryString = searchParams.toString();
  if (!queryString) {
    return base;
  }

  return `${base}?${queryString}`;
}

async function requestRaw<P>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<P> {
  const { method = "GET", body, params, authenticated = true, signal } =
    options;
  const headers: Record<string, string> = {};

  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  if (authenticated) {
    const token = getAuthToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  let response: Response;
  try {
    response = await fetch(buildRequestUrl(path, params), {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal,
    });
  } catch {
    throw new ApiClientError({
      status: 0,
      code: "NETWORK_ERROR",
    });
  }

  if (response.status === 204) {
    return undefined as P;
  }

  if (!response.ok) {
    // Handle Cloudflare WAF 429 rate limiting (which may return non-JSON HTML/text)
    if (response.status === 429) {
      throw new ApiClientError({
        status: 429,
        code: "RATE_LIMITED",
      });
    }

    let parsedError: ErrorEnvelope | null = null;
    try {
      parsedError = (await response.json()) as ErrorEnvelope;
    } catch {
      // Non-JSON edge response (e.g. Cloudflare WAF 403 or 502)
    }

    const fallbackCode =
      response.status === 401
        ? "UNAUTHORIZED"
        : response.status === 403
          ? "FORBIDDEN"
          : response.status === 404
            ? "NOT_FOUND"
            : response.status === 409
              ? "ALREADY_EXISTS"
              : response.status === 422 || response.status === 400
                ? "VALIDATION_ERROR"
                : "INTERNAL_SERVER_ERROR";

    throw new ApiClientError({
      status: response.status,
      code: parsedError?.code ?? fallbackCode,
      resource: parsedError?.resource,
      params: parsedError?.params,
    });
  }

  return (await response.json()) as P;
}

export async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const payload = await requestRaw<SuccessEnvelope<T> | T>(path, options);
  if (
    payload !== null &&
    typeof payload === "object" &&
    "data" in payload
  ) {
    return (payload as SuccessEnvelope<T>).data;
  }

  return payload as T;
}

export async function apiPaginatedRequest<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<PaginatedResponse<T>> {
  return requestRaw<PaginatedResponse<T>>(path, options);
}
