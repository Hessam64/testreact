const DEFAULT_BASE_URL = 'http://localhost:4000';

const stripTrailingSlash = (value) => {
  if (!value) {
    return value;
  }

  return value.endsWith('/') ? value.slice(0, -1) : value;
};

const deriveBaseFromLegacy = () => {
  const legacy = process.env.BACKEND_API_URL;

  if (!legacy) {
    return null;
  }

  if (legacy.endsWith('/api/ping')) {
    return stripTrailingSlash(legacy.replace(/\/api\/ping$/, ''));
  }

  return null;
};

const getBackendBaseUrl = () => {
  if (process.env.BACKEND_API_BASE_URL) {
    return stripTrailingSlash(process.env.BACKEND_API_BASE_URL);
  }

  const derived = deriveBaseFromLegacy();
  if (derived) {
    return derived;
  }

  return DEFAULT_BASE_URL;
};

export const buildBackendUrl = (path) => {
  const base = stripTrailingSlash(getBackendBaseUrl());
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${base}${normalizedPath}`;
};

export const getBackendPingUrl = () => {
  if (!process.env.BACKEND_API_BASE_URL && process.env.BACKEND_API_URL) {
    return process.env.BACKEND_API_URL;
  }

  return buildBackendUrl('/api/ping');
};
