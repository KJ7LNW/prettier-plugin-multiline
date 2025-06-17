export interface PrinterHook {
  nodeType: string;
  optionKey: string;
  print: (path: any, options: any, print: any) => any;
  validOptions?: string[];
  conflictsWith?: string[];
}