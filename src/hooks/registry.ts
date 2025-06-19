import { PrinterHook } from './types';

export class PrintHookRegistry {
  private static hooks = new Map<string, PrinterHook>();

  public static register(hook: PrinterHook) {
    if (this.hooks.has(hook.nodeType)) {
      throw new Error(`Hook for node type "${hook.nodeType}" is already registered.`);
    }
    this.hooks.set(hook.nodeType, hook);
  }

  public static getHook(nodeType: string): PrinterHook | undefined {
    return this.hooks.get(nodeType);
  }

  public static clear() {
    this.hooks.clear();
  }

  public static unregister(nodeType: string) {
    if (this.hooks.has(nodeType)) {
      this.hooks.delete(nodeType);
    }
  }

  public static validateOptions(options: Record<string, any>): string[] {
    const errors: string[] = [];
    const enabledHooks: PrinterHook[] = [];
    
    // Identify enabled hooks
    for (const hook of this.hooks.values()) {
      if (options[hook.optionKey]) {
        enabledHooks.push(hook);
      }
    }
    
    // Check for conflicts between enabled hooks
    for (const hook of enabledHooks) {
      if (hook.conflictsWith) {
        for (const conflictingKey of hook.conflictsWith) {
          if (options[conflictingKey]) {
            errors.push(`Option '${hook.optionKey}' conflicts with '${conflictingKey}'`);
          }
        }
      }
    }
    
    // Validate that all options are supported by at least one enabled hook
    const validOptionKeys = new Set<string>();
    
    // Always include the option keys themselves as valid
    for (const hook of enabledHooks) {
      validOptionKeys.add(hook.optionKey);
      
      // Add all valid options for this hook
      if (hook.validOptions) {
        for (const validOption of hook.validOptions) {
          validOptionKeys.add(validOption);
        }
      }
    }
    
    // Check if any provided option is not in the valid options set
    for (const optionKey of Object.keys(options)) {
      if (!validOptionKeys.has(optionKey)) {
        errors.push(`Unsupported option: '${optionKey}'`);
      }
    }
    
    return errors;
  }
}