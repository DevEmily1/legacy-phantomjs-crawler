onst fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');
const minimist = require('minimist');
const { crawlQueue } = require('./utils/request_handler');
const { writeDataset } = require('./output/dataset_writer');

function readJsonFile(filePath) {
const absolute = path.resolve(filePath);
if (!fs.existsSync(absolute)) {
throw new Error(`JSON file not found at ${absolute}`);
}
const content = fs.readFileSync(absolute, 'utf8');
try {
return JSON.parse(content);
} catch (err) {
throw new Error(`Failed to parse JSON at ${absolute}: ${err.message}`);
}
}

function loadInputs({ inputs, inputsPath }) {
if (Array.isArray(inputs) && inputs.length > 0) {
return inputs;
}
const fallbackPath = inputsPath || path.join(__dirname, '..', 'data', 'inputs.json');
const data = readJsonFile(fallbackPath);
if (!Array.isArray(data)) {
throw new Error(`Inputs JSON must be an array. File: ${fallbackPath}`);
}
return data;
}

function loadProxySettings(proxyConfigPath) {
const absolute = proxyConfigPath || path.join(__dirname, 'config', 'proxy_settings.json');
if (!fs.existsSync(absolute)) {
return null;
}
try {
const content = fs.readFileSync(absolute, 'utf8');
return JSON.parse(content);
} catch (err) {
console.error(`[Crawler] Failed to load proxy settings from ${absolute}: ${err.message}`);
return null;
}
}

function sendFinishWebhook(webhookUrl, payload, logger = console) {
return new Promise((resolve) => {
if (!webhookUrl) return resolve();
try {
const url = new URL(webhookUrl);
const data = JSON.stringify(payload);
const client = url.protocol === 'http:' ? http : https;

const req = client.request(
{
hostname: url.hostname,
port: url.port || (url.protocol === 'http:' ? 80 : 443),
path: url.pathname + (url.search || ''),
method: 'POST',
headers: {
'Content-Type': 'application/json',
'Content-Length': Buffer.byteLength(data),
},
},
(res) => {
res.on('data', () => {});
res.on('end', () => resolve());
},
);

req.on('error', (err) => {
logger.error('[Crawler] Finish webhook error:', err.message);
resolve();
});

req.write(data);
req.end();
} catch (err) {
logger.error('[Crawler] Finish webhook failed to send:', err.message);
resolve();
}
});
}

/**
* Default page function used when none is supplied.
* Runs in the browser context.
*/
function defaultPageFunction(context) {
const title = document.title || '';
const metas = Array.prototype.slice
.call(document.querySelectorAll('meta[name], meta[property]'))
.map((m) => ({
name: m.getAttribute('name') || m.getAttribute('property'),
content: m.getAttribute('content'),
}));
return {
url: context.url,
label: context.label,
title,
metas,
};
}

/**
* Main crawler runner used both programmatically and via CLI.
*/
async function runCrawler(options = {}) {
const {
inputs,
inputsPath,
outputPath,
format = 'json',
pageFunction,
interceptRequest,
proxyConfigPath,
maxDepth = 1,
waitFor = 3000,
navigationTimeout = 30000,
followLinksSelector,
finishWebhookUrl,
logger = console,
} = options;

const startedAt = new Date().toISOString();
logger.info('[Crawler] Starting crawl run at', startedAt);

const loadedInputs = loadInputs({ inputs, inputsPath });
const proxySettings = loadProxySettings(proxyConfigPath);

const effectivePageFunction = typeof pageFunction === 'function' ? pageFunction : defaultPageFunction;

const crawlOptions = {
maxDepth,
waitFor,
navigationTimeout,
followLinksSelector,
proxySettings,
interceptRequest,
logger,
};

const results = await crawlQueue({
requests: loadedInputs,
options: crawlOptions,
pageFunction: effectivePageFunction,
});

const finalOutputPath =
outputPath || path.join(__dirname, '..', 'data', 'sample_results.json');

await writeDataset(results, {
outputPath: finalOutputPath,
format,
logger,
});

const finishedAt = new Date().toISOString();
logger.info(
`[Crawler] Finished crawl run at ${finishedAt}, processed ${results.length} pages.`,
);

await sendFinishWebhook(
finishWebhookUrl,
{
startedAt,
finishedAt,
totalRequests: loadedInputs.length,
totalResults: results.length,
outputPath: finalOutputPath,
},
logger,
);

return {
startedAt,
finishedAt,
totalRequests: loadedInputs.length,
totalResults: results.length,
outputPath: finalOutputPath,
results,
};
}

/**
* CLI entry point.
* Example:
*   node src/crawler.js \
*     --input ./data/inputs.json \
*     --output ./data/results.json \
*     --format json \
*     --pageFunction ./examples/sample_page_function.js \
*     --maxDepth 2 \
*     --followLinksSelector "a"
*/
async function runCli() {
const argv = minimist(process.argv.slice(2));

const inputPath = argv.input || argv.i;
const outputPath = argv.output || argv.o;
const format = argv.format || argv.f || 'json';
const maxDepth = Number(argv.maxDepth || argv.d || 1);
const waitFor = Number(argv.waitFor || argv.wait || 3000);
const navigationTimeout = Number(argv.navigationTimeout || argv.navTimeout || 30000);
const followLinksSelector = argv.followLinksSelector || argv.linksSelector;
const proxyConfigPath = argv.proxyConfig || argv.proxy;
const finishWebhookUrl = argv.finishWebhook || argv.webhook;

let pageFunction = null;
if (argv.pageFunction || argv['page-function']) {
const pfPath = path.resolve(process.cwd(), argv.pageFunction || argv['page-function']);
// eslint-disable-next-line global-require, import/no-dynamic-require
pageFunction = require(pfPath);
if (pageFunction && typeof pageFunction.default === 'function') {
pageFunction = pageFunction.default;
}
if (typeof pageFunction !== 'function') {
throw new Error(
`Page function module at ${pfPath} must export a function (default or module.exports).`,
);
}
}

let interceptRequest = null;
if (argv.interceptRequest || argv['intercept-request']) {
const irPath = path.resolve(
process.cwd(),
argv.interceptRequest || argv['intercept-request'],
);
// eslint-disable-next-line global-require, import/no-dynamic-require
interceptRequest = require(irPath);
if (interceptRequest && typeof interceptRequest.default === 'function') {
interceptRequest = interceptRequest.default;
}
if (typeof interceptRequest !== 'function') {
throw new Error(
`Intercept module at ${irPath} must export a function (default or module.exports).`,
);
}
}

await runCrawler({
inputsPath: inputPath,
outputPath,
format,
pageFunction,
interceptRequest,
proxyConfigPath,
maxDepth,
waitFor,
navigationTimeout,
followLinksSelector,
finishWebhookUrl,
logger: console,
});
}

module.exports = {
runCrawler,
};

if (require.main === module) {
runCli().catch((err) => {
// eslint-disable-next-line no-console
console.error('[Crawler] Fatal error:', err);
process.exitCode = 1;
});
}