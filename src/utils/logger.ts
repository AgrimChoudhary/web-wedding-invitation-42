type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogMessage {
  level: LogLevel;
  message: string;
  data?: any;
  timestamp: string;
  component?: string;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';
  private enabledLevels: LogLevel[] = this.isDevelopment 
    ? ['debug', 'info', 'warn', 'error']
    : ['warn', 'error'];

  private formatMessage(level: LogLevel, message: string, data?: any, component?: string): LogMessage {
    return {
      level,
      message,
      data,
      timestamp: new Date().toISOString(),
      component,
    };
  }

  private shouldLog(level: LogLevel): boolean {
    return this.enabledLevels.includes(level);
  }

  private log(level: LogLevel, message: string, data?: any, component?: string) {
    if (!this.shouldLog(level)) return;

    const logMessage = this.formatMessage(level, message, data, component);
    const prefix = component ? `[${component}]` : '';
    
    switch (level) {
      case 'debug':
        console.debug(`🐛 ${prefix} ${message}`, data || '');
        break;
      case 'info':
        console.info(`ℹ️ ${prefix} ${message}`, data || '');
        break;
      case 'warn':
        console.warn(`⚠️ ${prefix} ${message}`, data || '');
        break;
      case 'error':
        console.error(`❌ ${prefix} ${message}`, data || '');
        break;
    }

    // Send to monitoring service in production
    if (!this.isDevelopment && (level === 'error' || level === 'warn')) {
      this.sendToMonitoring(logMessage);
    }
  }

  private sendToMonitoring(logMessage: LogMessage) {
    // Send to your monitoring service (e.g., Sentry, LogRocket, etc.)
    if ((window as any).gtag) {
      (window as any).gtag('event', 'log', {
        custom_parameter_level: logMessage.level,
        custom_parameter_message: logMessage.message,
        custom_parameter_component: logMessage.component,
      });
    }
  }

  debug(message: string, data?: any, component?: string) {
    this.log('debug', message, data, component);
  }

  info(message: string, data?: any, component?: string) {
    this.log('info', message, data, component);
  }

  warn(message: string, data?: any, component?: string) {
    this.log('warn', message, data, component);
  }

  error(message: string, data?: any, component?: string) {
    this.log('error', message, data, component);
  }
}

export const logger = new Logger();

// Convenience function for component-specific logging
export const createComponentLogger = (componentName: string) => ({
  debug: (message: string, data?: any) => logger.debug(message, data, componentName),
  info: (message: string, data?: any) => logger.info(message, data, componentName),
  warn: (message: string, data?: any) => logger.warn(message, data, componentName),
  error: (message: string, data?: any) => logger.error(message, data, componentName),
});