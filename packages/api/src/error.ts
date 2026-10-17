import { ZodError } from 'zod';

/**
 * Shared error payload for Fastify handlers and Next.js server actions.
 *
 * HTTP APIs should use an appropriate 4xx/5xx status with this object as the JSON body.
 * Server actions return `ErrorResponse` on failure (success typically uses `redirect()`).
 */

/** Shared codes for {@link ErrorResponse} and {@link errorResponse}. */
export const ErrorCode = {
  UnknownError: 'unknown_error',
  ValidationFailed: 'validation_failed',
} as const;

/** One issue: validation field, nested resource, or a single logical failure. */
export type ErrorDetail = {
  /** Stable identifier for clients and tests (e.g. `invalid_email`, `missing_field`). */
  code: string;
  /** Human-readable text safe to show in the UI. */
  message: string;
  /** Form or request field name when the issue is tied to input (e.g. `email`). */
  field?: string;
};

/** Optional top-level `code` / `message` before defaults are applied (see {@link errorResponse}). */
export type ErrorResponseSummary = {
  code?: string;
  message?: string;
};

/**
 * Standard failure body: resolved summary plus detail list.
 *
 * `code` / `message` are required on the wire; use {@link ErrorResponseSummary} when building.
 */
export type ErrorResponse = Required<ErrorResponseSummary> & {
  errors: ErrorDetail[];
};

const defaultSummary = {
  code: ErrorCode.UnknownError,
  message: 'Something went wrong.',
} as const satisfies Required<ErrorResponseSummary>;

const validationFallbackMessage = 'Please fix the errors in the form.';

/** At least one {@link Error} is required for {@link errorResponse}. */
export type NonEmptyErrors = readonly [Error, ...Error[]];

function zodPathToField(path: PropertyKey[]): string | undefined {
  if (path.length === 0) {
    return undefined;
  }
  return path.map(String).join('.');
}

function zodIssueToDetail(issue: ZodError['issues'][number]): ErrorDetail {
  const field = zodPathToField(issue.path);
  return field === undefined
    ? { code: issue.code, message: issue.message }
    : { code: issue.code, message: issue.message, field };
}

function errorToDetail(error: Error): ErrorDetail {
  return {
    code: error.name !== 'Error' ? error.name : defaultSummary.code,
    message: error.message || defaultSummary.message,
  };
}

function errorsToDetails(errors: NonEmptyErrors): ErrorDetail[] {
  const details: ErrorDetail[] = [];
  for (const error of errors) {
    if (error instanceof ZodError) {
      for (const issue of error.issues) {
        details.push(zodIssueToDetail(issue));
      }
      continue;
    }
    details.push(errorToDetail(error));
  }
  return details;
}

/**
 * Build `{ code, message, errors }` from one or more {@link Error} values.
 *
 * {@link ZodError} issues are mapped to {@link ErrorDetail} entries with `validation_failed`
 * as the default top-level code unless `summary` overrides it.
 */
export function errorResponse(
  errors: NonEmptyErrors,
  summary?: ErrorResponseSummary,
): ErrorResponse {
  const [first] = errors;
  const details = errorsToDetails(errors);
  const isValidation = first instanceof ZodError;

  return {
    code: summary?.code ?? (isValidation ? ErrorCode.ValidationFailed : defaultSummary.code),
    message:
      summary?.message ??
      (isValidation
        ? (details[0]?.message ?? validationFallbackMessage)
        : (first.message ?? defaultSummary.message)),
    errors: details,
  };
}
