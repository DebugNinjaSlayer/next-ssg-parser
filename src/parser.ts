import { children } from "cheerio/dist/commonjs/api/traversing";

export function nodeToMarkdown(node: any): string {
  if (typeof node === "string") {
    if (node === "\n") return "\n";
    return node;
  }
  // React Element: ["$r", type, key, props]
  if (Array.isArray(node)) {
    if (node[0] === "$r") {
      const type = node[1];
      const props = node[3] || { children: [] };
      switch (type) {
        case "h1":
        case "h2":
        case "h3":
        case "h4":
        case "h5":
        case "h6": {
          const level = Number(type[1]);
          return `\n${"#".repeat(level)} ${nodeToMarkdown(props.children)}\n`;
        }
        case "p":
          return `\n${nodeToMarkdown(props.children)}\n`;
        case "ul": {
          const children = props.children || [];
          return (
            "\n" +
            (Array.isArray(children)
              ? children.map((li) => nodeToMarkdown(li)).join("")
              : nodeToMarkdown(children)) +
            "\n"
          );
        }
        case "ol": {
          const children = props.children || [];
          return (
            "\n" +
            (Array.isArray(children)
              ? children.map(nodeToMarkdown).join("")
              : nodeToMarkdown(children)) +
            "\n"
          );
        }
        case "li":
          return `- ${nodeToMarkdown(props.children)}\n`;
        case "a":
          return `[${nodeToMarkdown(props.children)}](${props.href})`;
        case "strong":
          return `**${nodeToMarkdown(props.children)}**`;
        case "em":
          return `*${nodeToMarkdown(props.children)}*`;
        case "code":
          const className = props.className; // TODO: get current language from props.meta like "language-tsx"
          if (
            className ||
            (typeof props.children === "string" &&
              props.children.includes("\n"))
          ) {
            const meta = props.meta;
            return `${meta ? `${meta}\n` : ""}\`\`\`${
              className ? className : ""
            }\n${nodeToMarkdown(props.children)}\n\`\`\``;
          }
          return `\`${nodeToMarkdown(props.children)}\``;
        case "pre":
          return `\n${nodeToMarkdown(props.children)}\n`;
        case "hr":
          return "\n\n";
        case "Solution":
          if (props.children) {
            return `Solution\n\n${nodeToMarkdown(props.children)}\n\n`;
          }
          return "";
        default: {
          return nodeToMarkdown(props.children);
        }
      }
    } else {
      return node.map(nodeToMarkdown).join("");
    }
  }
  return "";
}
