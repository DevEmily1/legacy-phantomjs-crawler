'use strict';

var expect = require('chai').expect;
var ProxyHandler = require('../../../src/utils/proxy_handler');

describe('ProxyHandler', function () {
  it('cycles through proxies in round-robin order', function () {
    var handler = ProxyHandler.createProxyHandler({
      proxyUrls: ['http://proxy1:8000', 'http://proxy2:8000'],
    });

    var first = handler.getNextProxy();
    var second = handler.getNextProxy();
    var third = handler.getNextProxy();

    expect(first).to.equal('http://proxy1:8000');
    expect(second).to.equal('http://proxy2:8000');
    expect(third).to.equal('http://proxy1:8000');
  });

  it('builds PhantomJS args from proxy URL', function () {
    var handler = ProxyHandler.createProxyHandler({
      proxyUrl: 'http://user:pass@proxy1:8000',
    });

    var proxyUrl = handler.getNextProxy();
    var args = handler.buildPhantomArgs(proxyUrl);
    var joined = args.join(' ');

    expect(joined).to.contain('--proxy=proxy1:8000');
    expect(joined).to.contain('--proxy-type=http');
    expect(joined).to.contain('--proxy-auth=user:pass');
  });
});