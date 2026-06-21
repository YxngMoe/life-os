/* Injected at build time via vite.config.js define */
export const BUILD_TIME = __BUILD_TIME__;
export const BUILD_SHA = __BUILD_SHA__;
export const BUILD_VERSION = __BUILD_VERSION__;

export function formatBuildTime(iso = BUILD_TIME) {
  return new Date(iso).toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short',
  });
}

export function buildLabel() {
  return `v${BUILD_VERSION} · ${BUILD_SHA}`;
}
