import path from 'path';

export const FILES_PATH =
  process.env.NODE_ENV === 'production'
    ? '/app/files'
    : path.join(__dirname, '..', 'files');

// Built front client, served as static files
export const PUBLIC_PATH =
  process.env.NODE_ENV === 'production'
    ? '/app/public'
    : path.join(__dirname, '..', '..', 'front', 'build');

// Mounted as a Compose secret in production
export const SERVICE_ACCOUNT_PATH =
  process.env.GOOGLE_APPLICATION_CREDENTIALS ??
  path.join(FILES_PATH, 'service-account.json');
