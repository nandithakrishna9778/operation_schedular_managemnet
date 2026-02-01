const LOG_LEVELS = {
  INFO: "INFO",
  WARN: "WARN",
  ERROR: "ERROR"
};

export function logInfo(message, data = null) {
  console.log(`[${LOG_LEVELS.INFO}] ${message}`, data || "");
}

export function logWarn(message, data = null) {
  console.warn(`[${LOG_LEVELS.WARN}] ${message}`, data || "");
}

export function logError(message, error = null) {
  console.error(`[${LOG_LEVELS.ERROR}] ${message}`, error || "");
}
