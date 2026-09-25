import type { ApiResponse } from "../types/api";

interface ApiRequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  token?: string;
}

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

const getApiUrl = (path: string) => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  if (!baseUrl) {
    throw new Error("VITE_API_BASE_URL 환경 변수가 설정되지 않았습니다.");
  }

  return `${baseUrl.replace(/\/$/, "")}${path}`;
};

export async function request<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const { body, headers, token, ...requestOptions } = options;
  const requestHeaders = new Headers(headers);

  requestHeaders.set("Accept", "application/json");

  if (body !== undefined) {
    requestHeaders.set("Content-Type", "application/json");
  }

  if (token) {
    requestHeaders.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(getApiUrl(path), {
    ...requestOptions,
    headers: requestHeaders,
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  const payload = (await response.json()) as ApiResponse<T>;

  if (!response.ok || !payload.success) {
    throw new ApiError(
      payload.message ?? "요청을 처리하지 못했습니다.",
      response.status,
    );
  }

  return payload.data;
}
