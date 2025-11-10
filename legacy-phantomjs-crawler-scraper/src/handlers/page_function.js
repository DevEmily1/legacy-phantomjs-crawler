js/* eslint-env browser */
/* eslint-disable no-undef */

module.exports = function pageFunction(label) {
  // Runs inside the page context.
  var results = [];
  var nodes = document.querySelectorAll('h1, h2, h3, a');

  for (var i = 0; i < nodes.length; i++) {
    var node = nodes[i];
    var text = (node.textContent || '').replace(/\s+/g, ' ').trim();
    if (!text) continue;

    var tag = node.tagName ? node.tagName.toLowerCase() : 'unknown';
    var href = tag === 'a' ? node.href : null;

    results.push({
      label: label,
      tag: tag,
      text: text,
      href: href,
    });
  }

  return results;
};