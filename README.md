# Prettier Multiline Plugin

A Prettier plugin that formats imports, arrays, and objects on multiple lines to minimize merge conflicts in collaborative development environments.

## Why Multi-line Formatting Matters

### The Problem: Merge Conflicts in Collaborative Development

In large projects with multiple developers working simultaneously, merge conflicts are a common pain point that slow down development and integration. One of the most frequent sources of these conflicts is single-line formatting of imports, arrays, and objects.

Consider this common scenario:

1. Developer A adds a new import to a file:
   ```javascript
   import { alpha, beta, delta, gamma } from 'module';
   ```

2. Meanwhile, Developer B also adds a different import to the same line:
   ```javascript
   import { alpha, beta, epsilon, gamma } from 'module';
   ```

3. When merging these changes, a conflict occurs that must be manually resolved:
   ```
   <<<<<<< HEAD
   import { alpha, beta, delta, gamma } from 'module';
   =======
   import { alpha, beta, epsilon, gamma } from 'module';
   >>>>>>> feature-branch
   ```

These conflicts are:
- **Time-consuming**: Each must be manually resolved
- **Error-prone**: Easy to accidentally remove someone's import
- **Frequent**: Happens constantly in active projects

### The Solution: Multi-line Formatting

By formatting imports, arrays, and objects with one item per line, merge conflicts become both less frequent and easier to resolve:

```javascript
import {
  alpha,
  beta,
  delta,
  gamma,
} from 'module';
```

#### Benefits:

1. **Reduced Conflict Frequency**: Changes to different items won't conflict
2. **Clearer Diffs**: Git diffs show exactly which item was added/removed
3. **Easier Resolution**: When conflicts do occur, they're isolated to specific items
4. **Better Code Reviews**: Reviewers can clearly see which items were modified
5. **Improved Maintainability**: Easier to alphabetize or organize imports

### Real-world Example

#### With single-line formatting:

```diff
- import { alpha, beta, gamma } from 'module';
+ import { alpha, beta, delta, gamma } from 'module';
```

If two developers add different items, this creates a merge conflict.

#### With multi-line formatting:

```diff
  import {
    alpha,
    beta,
+   delta,
    gamma,
  } from 'module';
```

Even if two developers add different items, Git can often auto-merge these changes without conflicts.

## Installation

```bash
npm install --save-dev prettier-plugin-multiline
```

## Usage

Add the plugin to your Prettier configuration:

```json
{
  "plugins": ["prettier-plugin-multiline"],
  "multilineImports": true,
  "multilineArrays": true,
  "multilineObjects": true
}
```

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `multilineImports` | boolean | `false` | Format imports on multiple lines |
| `multilineArrays` | boolean | `false` | Format array literals on multiple lines |
| `multilineObjects` | boolean | `false` | Format object literals on multiple lines |
| `sortImports` | boolean | `false` | Sort import specifiers |
| `minItemsForMultiline` | number | `1` | Minimum number of items to trigger multiline formatting |
| `debug` | boolean | `false` | Enable debug output for the plugin |

## Example Configuration

For optimal merge conflict reduction in large projects:

```json
{
  "plugins": ["prettier-plugin-multiline"],
  "multilineImports": true,
  "multilineArrays": true,
  "multilineObjects": true,
  "minItemsForMultiline": 2
}
```

This configuration will format all imports, arrays, and objects with 2 or more items on multiple lines, significantly reducing merge conflicts in collaborative environments.

## License

MIT
