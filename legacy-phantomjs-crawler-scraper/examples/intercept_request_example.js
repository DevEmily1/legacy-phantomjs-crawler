onst path = require('path');
const { runCrawler } = require('../src/crawler');

/**
* Request interception function.
* Receives a simplified request object:
* {
*   url: string,
*   method: string,
*   resourceType: string,
*   headers: object
* }
*
* Return:
*   { action: 'abort' } to cancel the request
*   { action: 'continue' } to let it pass (default)
*/
function interceptRequest(req) {
// Block images, stylesheets and media to speed up crawling
const isAsset =
/\.(?:png|jpe?g|gif|svg|ico|webp|css|woff2?|ttf|eot|otf)$/i.test(req.url) ||
['image', 'media', 'font', 'stylesheet'].includes(req.resourceType);

if (isAsset) {
return { action: 'abort' };
}

return { action: 'continue' };
}

/**
* Minimal page function that just returns the page title.
*/
function lightPageFunction(context) {
return {
url: context.url,
label: context.label,
depth: context.depth,
title: document.title || '',
};
}

async function main() {
const inputsPath = path.join(__dirname, '..', 'data', 'inputs.json');
const outputPath = path.join(
__dirname,
'..',
'data',
'intercept_results.json',
);

await runCrawler({
inputsPath,
outputPath,
format: 'json',
pageFunction: lightPageFunction,
interceptRequest,
maxDepth: 1,
waitFor: 1500,
navigationTimeout: 20000,
logger: console,
});
}

if (require.main === module) {
main().catch((err) => {
// eslint-disable-next-line no-console
console.error('[Example] Intercept request example failed:', err);
process.exitCode = 1;
});
}

module.exports = interceptRequest;