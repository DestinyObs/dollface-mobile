import * as Sentry from '@sentry/react-native';

/**
 * Crash / error monitoring (Sentry). Real capture when EXPO_PUBLIC_SENTRY_DSN
 * is set; a no-op otherwise so nothing depends on it being configured.
 */

const DSN = process.env.EXPO_PUBLIC_SENTRY_DSN;
let enabled = false;

export function initMonitoring(): void {
  if (!DSN || enabled) return;
  try {
    Sentry.init({
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
  if (enabled) {
    try { Sentry.captureException(error); } catch { /* ignore */ }
  }
}
