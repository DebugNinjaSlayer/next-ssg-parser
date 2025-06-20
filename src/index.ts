import example from "./example.json" with { type: "json" };

const { props: { pageProps: { content } } } = example;

const nextContent = JSON.parse(content);

console.log(nextContent);
