js/**
* Runs a page function inside the browser context using Puppeteer's page.evaluate.
*
* The supplied pageFunction must be a plain function that can be serialized and run
* in the browser. It receives a single argument: "context", which is a plain object
* created on the Node.js side.
*/
async function runInPageContext(page, pageFunction, context) {
if (!page || typeof page.evaluate !== 'function') {
throw new Error('runInPageContext: page must be a Puppeteer Page instance');
}
if (typeof pageFunction !== 'function') {
throw new Error('runInPageContext: pageFunction must be a function');
}

const result = await page.evaluate(pageFunction, context || {});
return result;
}

module.exports = {
runInPageContext,
};