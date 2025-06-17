import { describe, it, expect, beforeEach } from 'vitest';
import { PrintHookRegistry } from '../registry';
import { PrinterHook } from '../types';

describe('PrintHookRegistry', () => {
  beforeEach(() => {
    PrintHookRegistry.clear();
  });

  it('should register and retrieve a hook', () => {
    const hook: PrinterHook = {
      nodeType: 'TestNode',
      optionKey: 'testOption',
      print: () => 'test output'
    };
    PrintHookRegistry.register(hook);
    const retrievedHook = PrintHookRegistry.getHook('TestNode');
    expect(retrievedHook).toBe(hook);
  });

  it('should throw an error when registering a duplicate hook', () => {
    const hook1: PrinterHook = {
      nodeType: 'TestNode',
      optionKey: 'testOption1',
      print: () => 'test output 1'
    };
    const hook2: PrinterHook = {
      nodeType: 'TestNode',
      optionKey: 'testOption2',
      print: () => 'test output 2'
    };
    PrintHookRegistry.register(hook1);
    expect(() => PrintHookRegistry.register(hook2)).toThrow(
      'Hook for node type "TestNode" is already registered.'
    );
  });

  it('should return undefined for a non-existent hook', () => {
    const retrievedHook = PrintHookRegistry.getHook('NonExistentNode');
    expect(retrievedHook).toBeUndefined();
  });

  it('should clear all registered hooks', () => {
    const hook: PrinterHook = {
      nodeType: 'TestNode',
      optionKey: 'testOption',
      print: () => 'test output'
    };
    PrintHookRegistry.register(hook);
    PrintHookRegistry.clear();
    const retrievedHook = PrintHookRegistry.getHook('TestNode');
    expect(retrievedHook).toBeUndefined();
  });

  describe('Option Validation', () => {
    it('should validate a set of valid options', () => {
      const hook: PrinterHook = {
        nodeType: 'TestNode',
        optionKey: 'enableTest',
        print: () => 'test output',
        validOptions: ['testConfig', 'testMode']
      };
      
      PrintHookRegistry.register(hook);
      
      const options = {
        enableTest: true,
        testConfig: 'value',
        testMode: 'strict'
      };
      
      const errors = PrintHookRegistry.validateOptions(options);
      expect(errors).toHaveLength(0);
    });
    
    it('should detect conflicting hooks', () => {
      const hook1: PrinterHook = {
        nodeType: 'TestNode1',
        optionKey: 'enableTest1',
        print: () => 'test output 1',
        conflictsWith: ['enableTest2']
      };
      
      const hook2: PrinterHook = {
        nodeType: 'TestNode2',
        optionKey: 'enableTest2',
        print: () => 'test output 2'
      };
      
      PrintHookRegistry.register(hook1);
      PrintHookRegistry.register(hook2);
      
      const options = {
        enableTest1: true,
        enableTest2: true
      };
      
      const errors = PrintHookRegistry.validateOptions(options);
      expect(errors).toHaveLength(1);
      expect(errors[0]).toBe("Option 'enableTest1' conflicts with 'enableTest2'");
    });
    
    it('should detect unsupported options', () => {
      const hook: PrinterHook = {
        nodeType: 'TestNode',
        optionKey: 'enableTest',
        print: () => 'test output',
        validOptions: ['testConfig', 'testMode']
      };
      
      PrintHookRegistry.register(hook);
      
      const options = {
        enableTest: true,
        testConfig: 'value',
        unknownOption: 'value'
      };
      
      const errors = PrintHookRegistry.validateOptions(options);
      expect(errors).toHaveLength(1);
      expect(errors[0]).toBe("Unsupported option: 'unknownOption'");
    });
    
    it('should handle multiple validation errors', () => {
      const hook1: PrinterHook = {
        nodeType: 'TestNode1',
        optionKey: 'enableTest1',
        print: () => 'test output 1',
        validOptions: ['testConfig'],
        conflictsWith: ['enableTest2']
      };
      
      const hook2: PrinterHook = {
        nodeType: 'TestNode2',
        optionKey: 'enableTest2',
        print: () => 'test output 2',
        validOptions: ['testMode']
      };
      
      PrintHookRegistry.register(hook1);
      PrintHookRegistry.register(hook2);
      
      const options = {
        enableTest1: true,
        enableTest2: true,
        unknownOption: 'value'
      };
      
      const errors = PrintHookRegistry.validateOptions(options);
      expect(errors).toHaveLength(2);
      expect(errors).toContain("Option 'enableTest1' conflicts with 'enableTest2'");
      expect(errors).toContain("Unsupported option: 'unknownOption'");
    });
    
    it('should not report errors when no hooks are enabled', () => {
      const hook: PrinterHook = {
        nodeType: 'TestNode',
        optionKey: 'enableTest',
        print: () => 'test output',
        validOptions: ['testConfig']
      };
      
      PrintHookRegistry.register(hook);
      
      const options = {
        someOtherOption: true
      };
      
      const errors = PrintHookRegistry.validateOptions(options);
      expect(errors).toHaveLength(1);
      expect(errors[0]).toBe("Unsupported option: 'someOtherOption'");
    });
  });
});