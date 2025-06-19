import { describe, it, expect, beforeAll } from 'vitest';
import fs from 'fs';
import path from 'path';
import prettier from 'prettier';
import plugin from '../index';

describe('Import Formatting Options', () => {
  const samplePath = path.resolve(__dirname, 'fixtures/sample-imports.ts');
  const defaultPath = path.resolve(__dirname, 'fixtures/sample-imports-default.ts');
  const multilinePath = path.resolve(__dirname, 'fixtures/sample-imports-multiline.ts');
  const sortedPath = path.resolve(__dirname, 'fixtures/sample-imports-sorted.ts');
  const multilineSortedPath = path.resolve(__dirname, 'fixtures/sample-imports-multiline-sorted.ts');
  
  let sample: string;
  let defaultFormatted: string;
  let multilineFormatted: string;
  let sortedFormatted: string;
  let multilineSortedFormatted: string;
  
  beforeAll(() => {
    sample = fs.readFileSync(samplePath, 'utf8');
    defaultFormatted = fs.readFileSync(defaultPath, 'utf8');
    multilineFormatted = fs.readFileSync(multilinePath, 'utf8');
    sortedFormatted = fs.readFileSync(sortedPath, 'utf8');
    multilineSortedFormatted = fs.readFileSync(multilineSortedPath, 'utf8');
  });
  
  it('should format with default settings', async () => {
    const formatted = await prettier.format(sample, {
      parser: 'typescript',
      plugins: [plugin],
    });
    
    expect(formatted).toBe(defaultFormatted);
  });
  
  it('should format with multiline imports', async () => {
    const formatted = await prettier.format(sample, {
      parser: 'typescript',
      plugins: [plugin],
      multilineImports: true,
    });
    
    expect(formatted).toBe(multilineFormatted);
  });
  
  it('should format with sorted imports', async () => {
    const formatted = await prettier.format(sample, {
      parser: 'typescript',
      plugins: [plugin],
      sortImports: true,
    });
    
    expect(formatted).toBe(sortedFormatted);
  });
  
  it('should format with both multiline and sorted imports', async () => {
    const formatted = await prettier.format(sample, {
      parser: 'typescript',
      plugins: [plugin],
      multilineImports: true,
      sortImports: true,
    });
    
    expect(formatted).toBe(multilineSortedFormatted);
  });

  // Behavioral validation tests - verify that options actually implement the expected behaviors
  it('multiline option should format imports with one identifier per line', () => {
    // Check for line breaks between identifiers in the multiline formatting
    const importBlocks = multilineFormatted.match(/import\s+{[^}]+}/gs) || [];
    
    for (const block of importBlocks) {
      if (block.includes(',')) {
        // For imports with multiple identifiers, check for newlines between identifiers
        const identifiers = block.match(/[a-zA-Z0-9_]+/g) || [];
        if (identifiers.length > 1) {
          // If multiple identifiers, the import should have newlines (one per line formatting)
          expect(block.includes('\n')).toBe(true);
          
          // Count identifiers and newlines to ensure roughly one newline per identifier
          const newlineCount = (block.match(/\n/g) || []).length;
          expect(newlineCount).toBeGreaterThanOrEqual(identifiers.length - 1);
        }
      }
    }
  });

  it('sort option should alphabetically sort import identifiers', () => {
    // Extract identifiers from imports and check they're sorted
    const importBlocks = sortedFormatted.match(/import\s+{([^}]+)}/g) || [];
    
    for (const block of importBlocks) {
      const identifiersMatch = block.match(/import\s+{([^}]+)}/);
      if (identifiersMatch && identifiersMatch[1]) {
        const identifiers = identifiersMatch[1].split(',').map(id => id.trim());
        
        if (identifiers.length > 1) {
          // Create a sorted copy and compare to original
          const sortedIdentifiers = [...identifiers].sort((a, b) =>
            a.localeCompare(b, undefined, { sensitivity: 'base' })
          );
          
          // If they're different after sorting, the original wasn't sorted
          expect(identifiers).toEqual(sortedIdentifiers);
        }
      }
    }
  });

  it('combined options should apply both one-per-line formatting and sorting', () => {
    // Check for both behaviors in the multiline-sorted output
    
    // 1. Check one-per-line formatting
    const importBlocks = multilineSortedFormatted.match(/import\s+{[^}]+}/gs) || [];
    
    for (const block of importBlocks) {
      if (block.includes(',')) {
        const identifiers = block.match(/[a-zA-Z0-9_]+/g) || [];
        if (identifiers.length > 1) {
          // Should have newlines for one-per-line formatting
          expect(block.includes('\n')).toBe(true);
        }
      }
    }
    
    // 2. Check sorting
    for (const block of importBlocks) {
      const lines = block.split('\n').filter(line => line.trim().length > 0);
      
      // Extract identifiers from each line
      const lineIdentifiers = lines
        .map(line => line.trim())
        .filter(line => !line.includes('import') && !line.includes('from') && !line.includes('}'))
        .map(line => line.replace(/,$/, '').trim());
      
      if (lineIdentifiers.length > 1) {
        // Create a sorted copy and compare to original
        const sortedLineIdentifiers = [...lineIdentifiers].sort((a, b) =>
          a.localeCompare(b, undefined, { sensitivity: 'base' })
        );
        
        // If they're different after sorting, the original wasn't sorted
        expect(lineIdentifiers).toEqual(sortedLineIdentifiers);
      }
    }
  });
});