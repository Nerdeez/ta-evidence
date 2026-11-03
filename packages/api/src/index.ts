export {
  ErrorCode,
  type ErrorDetail,
  type ErrorResponse,
  type ErrorResponseSummary,
  errorResponse,
  type NonEmptyErrors,
} from './error.js';
export {
  type RegisterApiKeyAuthOptions,
  registerApiKeyAuth,
} from './fastify/api-key.auth.js';
export {
  buildPaginationMeta,
  DEFAULT_LIMIT,
  DEFAULT_PAGE,
  MAX_LIMIT,
  type PageParams,
  type PaginationMeta,
  pageToOffset,
  parseLimit,
  parsePage,
} from './pagination.js';
