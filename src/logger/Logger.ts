import type { Logger } from 'loglevel';
import LogLevel from 'loglevel';
import { useDeviceStore } from '../stores/DeviceStore';

const apiKey = 'pub38e18c47920f849c87b25505a76bf504\n';
const source = 'react-native';
const service = 'beyond';

interface DataDogLogEntry {
  level: string;
  message: string;
  ddsource: string;
  service: string;
  host: string;
}

const dataDogLogger = (level: string, message: string) => {
  const host = useDeviceStore.getState().uuid;

  const logEntry: DataDogLogEntry = {
    level: level.toUpperCase(),
    message,
    ddsource: source,
    service,
    host,
  };

  const requestOptions: RequestInit = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },

    body: JSON.stringify(logEntry),
  };

  // Send log entry to DataDog using native fetch API
  fetch(
    `https://http-intake.logs.us5.datadoghq.com/api/v2/logs?dd-api-key=${apiKey}&ddsource=${source}&service=${service}&host=${host}`,
    requestOptions
  ).catch(error => {
    console.error('Error sending log to DataDog:', error);
  });
};

const logger: Logger = LogLevel.getLogger('app');
logger.setLevel(LogLevel.levels.TRACE);
logger.methodFactory = (methodName, logLevel, loggerName) => {
  const originalFactory = LogLevel.methodFactory(methodName, logLevel, loggerName);
  return (message: string) => {
    // Log to the console using loglevel
    originalFactory(message);

    // Send the log entry to DataDog
    dataDogLogger(methodName, message);
  };
};
LogLevel.getLogger('app').setLevel(LogLevel.levels.TRACE);

export function initLogger() {
  // Capture system console methods (e.g., console.log, console.error, etc.)
  const consoleMethods = ['log', 'info', 'warn', 'error', 'debug'];

  consoleMethods.forEach(method => {
    const originalConsoleMethod = console[method];
    console[method] = (...args: any[]) => {
      // Log to the console using loglevel
      originalConsoleMethod(...args);

      // Send the log entry to DataDog
      dataDogLogger(method, args.join(' '));
    };
  });
}

export default logger;
