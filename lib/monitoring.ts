/**
 * Crash / error monitoring (Sentry). Real capture when EXPO_PUBLIC_SENTRY_DSN
 * is set; a complete no-op otherwise.
 *
 * Sentry is loaded LAZILY (require, not a top-level import) and only when a DSN
 * is configured. This keeps the app working in Expo Go, where Sentry's native
 * module isn't present — importing it eagerly there could crash on launch.
 */

const DSN = process.env.EXPO_PUBLIC_SENTRY_DSN;
let sentry: typeof import('@sentry/react-native') | null = null;
let enabled = false;

export function initMonitoring(): void {
  if (!DSN || enabled) return;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    sentry = require('@sentry/react-native');
    sentry!.init({
      dsn: DSN,
      environment: __DEV__ ? 'development' : 'production',
      tracesSampleRate: 0.1,
    });
    enabled = true;
  } catch {
    /* ignore — never let monitoring setup break startup */
  }
}

export function captureException(error: unknown): void {
  if (enabled && sentry) {
    try { sentry.captureException(error); } catch { /* ignore */ }
  }
}
