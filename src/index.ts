import { nodeToMarkdown } from "./parser.js";
import * as cheerio from "cheerio";

export interface MarkdownResult {
  title: string;
  content: string;
  fullMarkdown: string;
}

export interface ParseOptions {
  timeout?: number;
  userAgent?: string;
}

/**
 * Parse Next.js SSG page and convert to Markdown
 * @param url - URL to parse
 * @param options - Parse options
 * @returns Markdown result with title and content
 */
export async function parseNextSSGToMarkdown(
  url: string,
  options: ParseOptions = {}
): Promise<MarkdownResult> {
  const {
    timeout = 10000,
    userAgent = "Mozilla/5.0 (compatible; NextSSGParser/1.0)",
  } = options;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": userAgent,
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    const nextDataScript = $("script#__NEXT_DATA__[type='application/json']");
    if (!nextDataScript.length) {
      throw new Error("Can't find __NEXT_DATA__ script tag");
    }

    const nextDataJson = nextDataScript.html();
    if (!nextDataJson) {
      throw new Error("__NEXT_DATA__ script tag is empty");
    }

    const nextData = JSON.parse(nextDataJson);

    const {
      props: {
        pageProps: { content },
      },
    } = nextData;

    if (!content) {
      throw new Error("No content found in pageProps");
    }

    const nextContent = JSON.parse(content);
    const markdown = nodeToMarkdown(nextContent);

    // Extract title
    const h1 = $("h1").first();
    const title = h1.length ? h1.contents().first().text().trim() : "Untitled";

    const fullMarkdown = `# ${title}\n\n${markdown}`;

    return {
      title,
      content: markdown,
      fullMarkdown,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to parse ${url}: ${error.message}`);
    }
    throw new Error(`Failed to parse ${url}: Unknown error`);
  }
}

export default parseNextSSGToMarkdown;
