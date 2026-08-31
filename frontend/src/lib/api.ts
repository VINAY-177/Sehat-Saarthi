"use client";

const PRODUCTION_API_URL = "https://swasthyasetu-ec55.onrender.com";
const LOCAL_API_URL = "http://localhost:5000";

function isLocalBrowser(): boolean {
  if (typeof window === "undefined") return process.env.NODE_ENV !== "production";
  return ["localhost", "127.0.0.1", "0.0.0.0"].includes(window.location.hostname);
}

export function getApiBaseUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_API_URL;
  if (envUrl && envUrl.trim()) return envUrl.trim().replace(/\/+$/, "");
  return isLocalBrowser() ? LOCAL_API_URL : PRODUCTION_API_URL;
}

export class ApiError extends Error {
  constructor(message: string, public readonly status?: number) {
    super(message);
    this.name = "ApiError";
  }
}

export function isAuthenticationError(error: unknown): boolean {
  return error instanceof ApiError && error.status === 401;
}

function getApiErrorMessage(data: unknown): string | undefined {
  if (!data || typeof data !== "object") return undefined;
  const errorData = data as { error?: unknown; message?: unknown };
  if (typeof errorData.error === "string") return errorData.error;
  if (typeof errorData.message === "string") return errorData.message;
  return undefined;
}

function getAuthHeaders(): Record<string, string> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("sehat-saathi-token");
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const baseUrl = getApiBaseUrl();
  if (!baseUrl) throw new ApiError("API URL is not configured");

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 6000);

  try {
    const res = await fetch(`${baseUrl}${normalizedPath}`, {
      ...options,
      headers: { ...getAuthHeaders(), ...(options.headers || {}) },
      signal: controller.signal,
    });

    if (!res.ok) {
      let errorData: unknown = {};
      try { errorData = await res.json(); } catch { errorData = {}; }
      const errorMessage = getApiErrorMessage(errorData);
      if (res.status === 401) {
        throw new ApiError(errorMessage || "Authentication required. Please log in to view and book appointments.", res.status);
      }
      throw new ApiError(errorMessage || `Request to ${path} failed with status ${res.status}`, res.status);
    }
    return res.json();
  } catch (err: unknown) {
    if (err instanceof Error && err.name === "AbortError") {
      throw new ApiError(`Request to ${path} timed out after 6 seconds.`);
    }
    throw err;
  } finally {
    clearTimeout(timeout);
  }
}

export async function apiGet<T>(path: string): Promise<T> { return apiFetch<T>(path, { method: "GET" }); }
export async function apiPost<T>(path: string, body: unknown): Promise<T> { return apiFetch<T>(path, { method: "POST", body: JSON.stringify(body) }); }
export async function apiPut<T>(path: string, body: unknown): Promise<T> { return apiFetch<T>(path, { method: "PUT", body: JSON.stringify(body) }); }
export async function apiPatch<T>(path: string, body: unknown): Promise<T> { return apiFetch<T>(path, { method: "PATCH", body: JSON.stringify(body) }); }
export async function apiDelete<T>(path: string): Promise<T> { return apiFetch<T>(path, { method: "DELETE" }); }
