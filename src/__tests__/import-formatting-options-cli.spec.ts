import { describe, it, expect, beforeAll } from 'vitest';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

describe('CLI with --sort-imports', () => {
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
  
  // Helper function to execute prettier CLI command and return the output
  function runPrettierCLI(filepath: string, options: string[] = []): string {
    const command = `npx prettier --plugin=./dist/index.js --parser=typescript ${options.join(' ')} ${filepath}`;
    const output = execSync(command, { encoding: 'utf8' }).trim();
    // console.debug(`======== ${filepath} ${options.join(' ')} \n`+ output)
    return output;
  }
  
  it('should format with default settings via CLI', () => {
    const formatted = runPrettierCLI(samplePath);
    expect(formatted).toBe(defaultFormatted.trim());
  });
  
  it('should format with multiline imports via CLI', () => {
    const formatted = runPrettierCLI(samplePath, ['--multiline-imports']);
    expect(formatted).toBe(multilineFormatted.trim());
  });
  
  it('should format with sorted imports via CLI', () => {
    const formatted = runPrettierCLI(samplePath, ['--sort-imports']);
    expect(formatted).toBe(sortedFormatted.trim());
  });
  
  it('should format with both multiline and sorted imports via CLI', () => {
    const formatted = runPrettierCLI(samplePath, ['--sort-imports', '--multiline-imports']);
    expect(formatted).toBe(multilineSortedFormatted.trim());
  });
  
  // Behavioral validation tests for CLI
  it('CLI sort-imports should alphabetically sort import identifiers', () => {
    const formatted = runPrettierCLI(samplePath, ['--sort-imports']);
    
    // Extract identifiers from imports and check they're sorted
    const importBlocks = formatted.match(/import\s+{([^}]+)}/g) || [];
    
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
});