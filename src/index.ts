import fs from "fs";
import { nodeToMarkdown } from "./parser.js";
import * as cheerio from "cheerio";

const url = "https://react.dev/reference/react/addTransitionType";

const response = await fetch(url);
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

const nextContent = JSON.parse(content);

const markdown = nodeToMarkdown(nextContent);

fs.writeFileSync("output.md", markdown);

console.log("done");
