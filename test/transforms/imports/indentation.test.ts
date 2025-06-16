import { describe, it, expect } from 'vitest';
import * as prettier from 'prettier';
import prettierPluginMultiline from '../../../src/index';

/**
 * Tests for the indentation of multiline imports.
 */
describe('Multiline Import Indentation', () => {
  it('should respect tabWidth setting for multiline imports', async () => {
    const input = `import DefaultExport, {z, a, b, c} from 'z';`;
    
    // Format with tabWidth: 4
    const formatted = await prettier.format(input, {
      parser: 'typescript',
      plugins: [prettierPluginMultiline],
      multilineImports: true,
      sortImports: true,
      tabWidth: 4
    });
    
    // Expected output with 4-space indentation
    // Named imports should be double-indented, closing brace single-indented
    const expected =
`import DefaultExport, {
        a,
        b,
        c,
        z,
    } from "z";
`;
    
    // Check if the indentation is correct (double indentation for imports, single for closing brace)
    expect(formatted).toContain('\n        a,');
    expect(formatted).toContain('\n        b,');
    expect(formatted).toContain('\n        c,');
    expect(formatted).toContain('\n        z,');
    expect(formatted).toContain('\n    }');
  });

  it('should respect useTabs setting for multiline imports', async () => {
    const input = `import DefaultExport, {z, a, b, c} from 'z';`;
    
    // Format with useTabs: true
    const formatted = await prettier.format(input, {
      parser: 'typescript',
      plugins: [prettierPluginMultiline],
      multilineImports: true,
      sortImports: true,
      useTabs: true
    });
    
    // Expected output with tab indentation
    // Named imports should be double-indented, closing brace single-indented
    const expected =
`import DefaultExport, {
\t\ta,
\t\tb,
\t\tc,
\t\tz,
\t} from "z";
`;
    
    // Check if the indentation is correct (double tabs for imports, single for closing brace)
    expect(formatted).toContain('\n\t\ta,');
    expect(formatted).toContain('\n\t\tb,');
    expect(formatted).toContain('\n\t\tc,');
    expect(formatted).toContain('\n\t\tz,');
    expect(formatted).toContain('\n\t}');
  });

  it('should respect both tabWidth and useTabs settings', async () => {
    const input = `import DefaultExport, {z, a, b, c} from 'z';`;
    
    // Format with tabWidth: 2 and useTabs: false (default)
    const formatted = await prettier.format(input, {
      parser: 'typescript',
      plugins: [prettierPluginMultiline],
      multilineImports: true,
      sortImports: true,
      tabWidth: 2,
      useTabs: false
    });
    
    // Expected output with 2-space indentation
    // Named imports should be double-indented, closing brace single-indented
    const expected =
`import DefaultExport, {
    a,
    b,
    c,
    z,
  } from "z";
`;
    
    // Check if the indentation is correct (double spaces for imports, single for closing brace)
    expect(formatted).toContain('\n    a,');
    expect(formatted).toContain('\n    b,');
    expect(formatted).toContain('\n    c,');
    expect(formatted).toContain('\n    z,');
    expect(formatted).toContain('\n  }');
  });
});