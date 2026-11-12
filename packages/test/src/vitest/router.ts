/** Stubs for browser component tests outside the Next.js App Router. */

export function useRouter() {
  return {
    push: () => {},
    replace: () => {},
    refresh: () => {},
    back: () => {},
    forward: () => {},
    prefetch: async () => {},
  };
}

export function usePathname(): string {
  return '/';
}

export function useSearchParams(): URLSearchParams {
  return new URLSearchParams();
}

export function useParams(): Record<string, string | string[]> {
  return {};
}

export function redirect(_url: string): never {
  throw new Error('redirect() is not available in component tests.');
}
