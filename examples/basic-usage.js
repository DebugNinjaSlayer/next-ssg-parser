import { parseNextSSGToMarkdown } from '../dist/index.js';

async function example() {
    try {
        const url = "https://react.dev/reference/react/addTransitionType";

        console.log('Parsing page...');
        const result = await parseNextSSGToMarkdown(url);

        console.log('Parse completed!');
        console.log('Title:', result.title);
        console.log('Content length:', result.content.length, 'characters');
        console.log('Full Markdown length:', result.fullMarkdown.length, 'characters');

        // Save to file
        const fs = await import('fs');
        fs.writeFileSync('example-output.md', result.fullMarkdown);
        console.log('Saved to example-output.md');

    } catch (error) {
        console.error('Parse failed:', error.message);
    }
}

example(); 