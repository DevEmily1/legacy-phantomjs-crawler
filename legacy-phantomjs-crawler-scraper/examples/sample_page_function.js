onst path = require('path');
const { runCrawler } = require('../src/crawler');

/**
* Example page function.
* This function runs in the browser context and can access "document".
*/
function samplePageFunction(context) {
const title = document.title || '';

const headings = Array.prototype.slice
.call(document.querySelectorAll('h1, h2'))
.map((h) => h.textContent.trim())
.filter(Boolean);

const links = Array.prototype.slice
.call(document.querySelectorAll('a[href]'))
.map((a) => ({
href: a.href,
text: (a.textContent || '').trim(),
}));

return {
url: context.url,
label: context.label,
depth: context.depth,
title,
headings,
links,
};
}

async function main() {
const inputsPath = path.join(__dirname, '..', 'data', 'inputs.json');
const outputPath = path.join(__dirname, '..', 'data', 'sample_results.json');

await runCrawler({
inputsPath,
outputPath,
format: 'json',
pageFunction: samplePageFunction,
maxDepth: 1,
waitFor: 2000,
navigationTimeout: 30000,
followLinksSelector: null,
logger: console,
});
}

// Allow use both as module and standalone script
if (require.main === module) {
main().catch((err) => {
// eslint-disable-next-line no-console
console.error('[Example] Sample page function run failed:', err);
process.exitCode = 1;
});
}

module.exports = samplePageFunction;