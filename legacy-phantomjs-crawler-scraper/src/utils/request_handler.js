onst puppeteer = require('puppeteer');
const { runInPageContext } = require('./page_context');

/**
* Launches a Puppeteer browser, optionally using proxy settings.
* proxySettings: {
*   mode: "none" | "single" | "rotating",
*   proxies: ["http://user:pass@host:port"],
*   groupSize: number
* }
*/
async function createBrowser(proxySettings, logger = console) {
const args = ['--no-sandbox', '--disable-setuid-sandbox'];

let activeProxy = null;
if (
proxySettings &&
Array.isArray(proxySettings.proxies) &&
proxySettings.proxies.length > 0 &&
proxySettings.mode &&
proxySettings.mode !== 'none'
) {
activeProxy = proxySettings.proxies[0];
try {
const url = new URL(activeProxy);
args.push(`--proxy-server=${url.protocol}//${url.hostname}:${url.port || 80}`);
logger.info('[Crawler] Using proxy', activeProxy);
} catch (err) {
logger.error('[Crawler] Invalid proxy URL, ignoring proxy settings:', err.message);
activeProxy = null;
}
}

const browser = await puppeteer.launch({
headless: true,
args,
});

return { browser, activeProxy };
}

async function setupInterception(page, interceptRequest, logger = console) {
if (typeof interceptRequest !== 'function') {
return;
}

await page.setRequestInterception(true);

page.on('request', async (req) => {
try {
const decision = await interceptRequest({
url: req.url(),
method: req.method(),
resourceType: req.resourceType(),
headers: req.headers(),
});

if (decision && decision.action === 'abort') {
return req.abort();
}

if (decision && decision.action === 'respond' && decision.response) {
return req.respond(decision.response);
}

return req.continue();
} catch (err) {
logger.error('[Crawler] Intercept error, continuing request:', err.message);
return req.continue();
}
});
}

/**
* Core crawl loop. Processes a queue of requests, optionally following links.
*
* Each request: { url: string, label?: string, depth?: number }
*/
async function crawlQueue({ requests, options = {}, pageFunction }) {
const {
maxDepth = 1,
waitFor = 3000,
navigationTimeout = 30000,
followLinksSelector,
proxySettings,
interceptRequest,
logger = console,
} = options;

if (!Array.isArray(requests) || !requests.length) {
throw new Error('crawlQueue requires a non-empty array of requests');
}

const { browser, activeProxy } = await createBrowser(proxySettings, logger);
const visited = new Set();
const queue = requests.map((r) => ({
url: r.url,
label: r.label || 'START',
depth: typeof r.depth === 'number' ? r.depth : 0,
}));
const results = [];

try {
while (queue.length > 0) {
const request = queue.shift();
if (!request || !request.url) continue;

// Avoid revisiting the same URL
if (visited.has(request.url)) {
continue;
}
visited.add(request.url);

const page = await browser.newPage();

await page.setUserAgent(
'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 ' +
'(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 LegacyCrawler',
);

await setupInterception(page, interceptRequest, logger);

const requestedAt = new Date().toISOString();
let responseStatus = null;
let loadedUrl = request.url;
let pageFunctionResult = null;
let cookies = [];
let errorInfo = null;
let discoveredLinks = [];

try {
logger.info('[Crawler] Navigating to', request.url);
const response = await page.goto(request.url, {
waitUntil: 'networkidle2',
timeout: navigationTimeout,
});

if (response) {
responseStatus = response.status();
loadedUrl = response.url();
}

if (waitFor && waitFor > 0) {
await page.waitForTimeout(waitFor);
}

// Run the user-supplied page function in page context
pageFunctionResult = await runInPageContext(page, pageFunction, {
url: loadedUrl,
label: request.label,
depth: request.depth,
});

// Optionally discover more links for recursive crawling
if (followLinksSelector && request.depth < maxDepth) {
try {
discoveredLinks = await page.$$eval(followLinksSelector, (els) =>
Array.prototype.slice
.call(els)
.map((el) => el.href)
.filter(Boolean),
);
} catch (err) {
logger.warn(
'[Crawler] Failed to extract links with selector',
followLinksSelector,
':',
err.message,
);
}
}

try {
cookies = await page.cookies();
} catch (err) {
logger.warn('[Crawler] Failed to read cookies:', err.message);
}
} catch (err) {
errorInfo = {
message: err.message,
stack: err.stack,
};
logger.error('[Crawler] Error crawling', request.url, ':', err.message);
} finally {
await page.close();
}

const result = {
loadedUrl,
requestedAt,
label: request.label,
pageFunctionResult,
responseStatus,
proxy: activeProxy,
cookies,
depth: request.depth,
errorInfo,
};

results.push(result);

// Enqueue newly discovered links
if (discoveredLinks && discoveredLinks.length > 0) {
for (const link of discoveredLinks) {
if (!link || typeof link !== 'string') continue;
if (visited.has(link)) continue;

queue.push({
url: link,
label: request.label || 'FOLLOWED',
depth: request.depth + 1,
});
}
}
}
} finally {
await browser.close();
}

return results;
}

module.exports = {
crawlQueue,
};