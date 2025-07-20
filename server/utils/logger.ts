
import winston from 'winston';
import path from 'path';

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss'
  }),
  winston.format.errors({ stack: true }),
  winston.format.json(),
  winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
    return JSON.stringify({
      timestamp,
      level,
      message,
      ...(stack && { stack }),
      ...meta
    });
  })
);

// Create logger instance
export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  defaultMeta: { service: 'sportx-cpd' },
  transports: [
    // Console transport for development
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }),
    
    // File transport for production
    ...(process.env.NODE_ENV === 'production' ? [
      new winston.transports.File({
        filename: path.join('logs', 'error.log'),
        level: 'error',
        maxsize: 5242880, // 5MB
        maxFiles: 5,
      }),
      new winston.transports.File({
        filename: path.join('logs', 'combined.log'),
        maxsize: 5242880, // 5MB
        maxFiles: 5,
      })
    ] : [])
  ],
});

// Create request logger middleware
export const requestLogger = (req: any, res: any, next: any) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logData = {
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}ms`,
      userAgent: req.get('User-Agent'),
      ip: req.ip || req.connection.remoteAddress,
      userId: req.user?.id || 'anonymous'
    };
    
    if (res.statusCode >= 400) {
      logger.warn('HTTP Request', logData);
    } else {
      logger.info('HTTP Request', logData);
    }
  });
  
  next();
};

// Error logger
export const errorLogger = (err: any, req: any, res: any, next: any) => {
  logger.error('Application Error', {
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    userId: req.user?.id || 'anonymous',
    ip: req.ip || req.connection.remoteAddress
  });
  
  next(err);
};

// Performance logger
export const performanceLogger = {
  logQuery: (query: string, duration: number, params?: any) => {
    logger.debug('Database Query', {
      query,
      duration: `${duration}ms`,
      params
    });
  },
  
  logApiCall: (service: string, endpoint: string, duration: number, status: number) => {
    logger.info('External API Call', {
      service,
      endpoint,
      duration: `${duration}ms`,
      status
    });
  }
};

export default logger;
