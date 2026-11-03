import { auth } from './api.auth.js';

/** Better Auth API Key plugin default (`apiKeyHeaders`). */
export const API_KEY_HEADER = 'x-api-key';

export type VerifyApiKeyResult = { ok: true } | { ok: false; message: string };

export function readApiKeyFromHeaders(
  headers: Record<string, string | string[] | undefined>,
  headerName: string = API_KEY_HEADER,
): string | undefined {
  const target = headerName.toLowerCase();
  const matchedKey = Object.keys(headers).find((name) => name.toLowerCase() === target);
  const raw = matchedKey === undefined ? undefined : headers[matchedKey];
  if (raw === undefined) {
    return undefined;
  }
  const value = Array.isArray(raw) ? raw[0] : raw;
  return value?.trim() || undefined;
}

export async function verifyApiKeyString(key: string): Promise<VerifyApiKeyResult> {
  const result = await auth.api.verifyApiKey({
    body: { key },
  });

  if (!result.valid) {
    const errorMessage = result.error?.message;
    const message =
      typeof errorMessage === 'string' && errorMessage.length > 0
        ? errorMessage
        : 'Invalid API key';
    return { ok: false, message };
  }

  return { ok: true };
}

export async function verifyApiKeyFromHeaders(
  headers: Record<string, string | string[] | undefined>,
): Promise<VerifyApiKeyResult> {
  const key = readApiKeyFromHeaders(headers);
  if (!key) {
    return { ok: false, message: 'Missing API key' };
  }
  return verifyApiKeyString(key);
}
