'use strict';

var url = require('url');

function createProxyHandler(config) {
  config = config || {};
  var list = [];

  if (Array.isArray(config.proxyUrls) && config.proxyUrls.length > 0) {
    list = config.proxyUrls.slice();
  } else if (config.proxyUrl) {
    list = [config.proxyUrl];
  }

  var index = 0;

  function getNextProxy() {
    if (!list.length) return null;
    var proxy = list[index];
    index = (index + 1) % list.length;
    return proxy;
  }

  function buildPhantomArgs(proxyUrl) {
    var args = ['--ignore-ssl-errors=yes', '--ssl-protocol=any'];
    if (!proxyUrl) return args;

    var parsed = url.parse(proxyUrl);
    var hostPort = (parsed.hostname || '') + (parsed.port ? ':' + parsed.port : '');

    if (hostPort) {
      args.push('--proxy=' + hostPort);
    }

    if (parsed.protocol) {
      var type = parsed.protocol.replace(':', '');
      args.push('--proxy-type=' + type);
    }

    if (parsed.auth) {
      args.push('--proxy-auth=' + parsed.auth);
    }

    return args;
  }

  return {
    getNextProxy: getNextProxy,
    buildPhantomArgs: buildPhantomArgs,
  };
}

module.exports = {
  createProxyHandler: createProxyHandler,
};