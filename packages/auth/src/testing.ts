/**
 * Test-only helpers for `@ta/auth`. Do not import from production app code.
 */
export {
  apiKeyHeaders,
  type CreateUserApiKeyInput,
  createTestApiKey,
  createUserApiKey,
} from './testing/api-key.js';
export {
  cleanupE2eSignup,
  createTestUser,
  type E2eSignupCredentials,
  type E2eSignupCredentialsBinder,
  e2eSignupCredentials,
  e2eSignupPassword,
} from './testing/user.js';
