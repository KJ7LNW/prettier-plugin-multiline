import { inspect } from 'util';

let isDebugEnabled = false;

export function enableDebug() {
  isDebugEnabled = true;
}

export function disableDebug() {
  isDebugEnabled = false;
}

export function setDebugState(enabled: boolean) {
  isDebugEnabled = enabled;
}

export function isDebugMode() {
  return isDebugEnabled;
}

export function debug(...args: any[]) {
  if (isDebugEnabled) {
    // Format objects and arrays using util.inspect for better readability
    const formattedArgs = args.map(arg =>
      typeof arg === 'object' && arg !== null
        ? inspect(arg, { depth: 5, colors: true, maxArrayLength: 10 })
        : arg
    );
    console.debug('[prettier-plugin-multiline]', ...formattedArgs);
  }
}