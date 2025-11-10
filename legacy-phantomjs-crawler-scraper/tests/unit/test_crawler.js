'use strict';

var expect = require('chai').expect;
var crawler = require('../../../src/crawler');

describe('filterDiscoveredUrls', function () {
  it('deduplicates URLs and respects maxDepth and maxLinksPerPage', function () {
    var options = {
      maxDepth: 1,
      maxLinksPerPage: 3,
    };

    var visited = {
      'https://a.com/': true,
    };

    var urls = [
      'https://a.com/',
      'https://b.com/',
      'https://c.com/',
      'https://d.com/',
    ];

    var result = crawler.filterDiscoveredUrls(urls, options, visited, 0);

    expect(result).to.have.length(3 - 1); // one visited, two remaining
    expect(result[0]).to.have.property('url', 'https://b.com/');
    expect(result[0]).to.have.property('depth', 1);
    expect(result[0]).to.have.property('label', 'FOLLOWED');
  });

  it('returns empty array when maxDepth is reached', function () {
    var options = {
      maxDepth: 1,
      maxLinksPerPage: 10,
    };
    var visited = {};
    var urls = ['https://a.com/'];

    var result = crawler.filterDiscoveredUrls(urls, options, visited, 1);
    expect(result).to.be.an('array').that.has.length(0);
  });
});