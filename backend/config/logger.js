/**
 * config/logger.js
 * Minimal logger helper - swap out for Winston/Pino in production.
 */

function info(...args) {
  console.log('[INFO]', ...args);
}

function error(...args) {
  console.error('[ERROR]', ...args);
}

module.exports = { info, error };
