/**
 * Test-only helpers for `@ta/auth`. Do not import from production app code.
 */
export { apiKeyHeaders, createTestApiKey } from './testing/api-key.js';
export {
  cleanupE2eSignup,
  createTestUser,
  deleteUserByEmail,
  type E2eSignupCredentials,
  type E2eSignupCredentialsBinder,
  e2eSignupCredentials,
  e2eSignupPassword,
} from './testing/user.js';
