# Next.js SSG Parser

A tool library for parsing Next.js Static Site Generation (SSG) pages and converting them to Markdown.

## Features

- 🚀 Extract content from Next.js SSG pages
- 📝 Automatically convert to Markdown format
- 🏷️ Extract page titles
- ⚡ Support timeout and custom User-Agent
- 📦 Full TypeScript support
- 🔧 Easy to integrate into other projects

## Installation

```bash
npm install next-ssg-parser
```

## Usage

### Basic Usage

```javascript
import { parseNextSSGToMarkdown } from "next-ssg-parser";

async function example() {
  try {
    const url = "https://react.dev/reference/react/addTransitionType";
    const result = await parseNextSSGToMarkdown(url);

    console.log("Title:", result.title);
    console.log("Content:", result.content);
    console.log("Full Markdown:", result.fullMarkdown);
  } catch (error) {
    console.error("Parse failed:", error.message);
  }
}
```

### Using Options

```javascript
import { parseNextSSGToMarkdown } from "next-ssg-parser";

const result = await parseNextSSGToMarkdown(url, {
  timeout: 15000, // Timeout in milliseconds, default 10000
  userAgent: "MyBot/1.0", // Custom User-Agent
});
```

## API Reference

### `parseNextSSGToMarkdown(url, options?)`

Parse Next.js SSG page and return Markdown content.

#### Parameters

- `url` (string): URL of the page to parse
- `options` (ParseOptions, optional): Parse options

#### Returns

Returns a Promise that resolves to a `MarkdownResult` object:

```typescript
interface MarkdownResult {
  title: string; // Page title
  content: string; // Page content (without title)
  fullMarkdown: string; // Complete Markdown (with title)
}

interface ParseOptions {
  timeout?: number; // Request timeout in milliseconds
  userAgent?: string; // Custom User-Agent
}
```

#### Error Handling

The function throws the following types of errors:

- Network request failures
- Page doesn't contain `__NEXT_DATA__` script tag
- Page content parsing failures
- Timeout errors

## Examples

### Batch Processing Multiple Pages

```javascript
import { parseNextSSGToMarkdown } from "next-ssg-parser";

const urls = [
  "https://react.dev/reference/react/addTransitionType",
  "https://react.dev/reference/react/useState",
  "https://react.dev/reference/react/useEffect",
];

async function batchProcess() {
  const results = [];

  for (const url of urls) {
    try {
      const result = await parseNextSSGToMarkdown(url);
      results.push(result);
      console.log(`✅ Successfully parsed: ${result.title}`);
    } catch (error) {
      console.error(`❌ Parse failed ${url}:`, error.message);
    }
  }

  return results;
}
```

### Save to File

```javascript
import { parseNextSSGToMarkdown } from "next-ssg-parser";
import fs from "fs";

async function saveToFile() {
  const result = await parseNextSSGToMarkdown(url);

  // Save complete Markdown
  fs.writeFileSync("output.md", result.fullMarkdown);

  // Or save content only
  fs.writeFileSync("content.md", result.content);
}
```

## Development

### Build

```bash
yarn build
```

### Development Mode

```bash
yarn dev
```

## License

MIT
