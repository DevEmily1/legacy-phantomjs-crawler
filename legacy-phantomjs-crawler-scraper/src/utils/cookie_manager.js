'use strict';

/**
 * Apply cookies to a PhantomJS page.
 * Expects cookies to be an array of cookie objects compatible with PhantomJS.
 */
function apply(page, cookies) {
  if (!page || !cookies || !cookies.length) {
    return Promise.resolve();
  }

  return page
    .property('cookies')
    .then(function (existing) {
      existing = existing || [];
      var all = existing.concat(cookies);
      return page.property('cookies', all);
    })
    .catch(function () {
      // ignore cookie errors so they don't break the crawl
    });
}

module.exports = {
  apply: apply,
};