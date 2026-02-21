type ErrorSeverity = 'info' | 'warning' | 'error' | 'critical';

interface ErrorLogEntry {
  timestamp: string;
  severity: ErrorSeverity;
  message: string;
  context?: Record<string, unknown>;
  stack?: string;
}

class ErrorLogger {
  private logs: ErrorLogEntry[] = [];
  private maxLogs = 100;

  log(severity: ErrorSeverity, message: string, context?: Record<string, unknown>, error?: Error) {
    const entry: ErrorLogEntry = {
      timestamp: new Date().toISOString(),
      severity,
      message,
      context,
      stack: error?.stack,
    };

    this.logs.push(entry);

    // Keep only the most recent logs
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // Console output with appropriate level
    const logMessage = `[${severity.toUpperCase()}] ${message}`;
    const logData = {
      ...context,
      ...(error && { error: error.message, stack: error.stack }),
    };

    switch (severity) {
      case 'critical':
      case 'error':
        console.error(logMessage, logData);
        break;
      case 'warning':
        console.warn(logMessage, logData);
        break;
      case 'info':
      default:
        console.log(logMessage, logData);
        break;
    }
  }

  info(message: string, context?: Record<string, unknown>) {
    this.log('info', message, context);
  }

  warning(message: string, context?: Record<string, unknown>) {
    this.log('warning', message, context);
  }

  error(message: string, context?: Record<string, unknown>, error?: Error) {
    this.log('error', message, context, error);
  }

  critical(message: string, context?: Record<string, unknown>, error?: Error) {
    this.log('critical', message, context, error);
  }

  getLogs(): ErrorLogEntry[] {
    return [...this.logs];
  }

  clearLogs() {
    this.logs = [];
  }
}

export const errorLogger = new ErrorLogger();
