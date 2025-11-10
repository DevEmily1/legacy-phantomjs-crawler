'use strict';

/**
 * Attach lightweight request/response handlers for performance and logging.
 */
function configure(page, options, logger) {
  if (!page || typeof page.on !== 'function') {
    return;
  }

  options = options || {};
  logger = logger || console;

  var blockedTypes = options.blockedResourceTypes || ['image', 'media', 'font'];
  var blockedDomains = options.blockedDomains || [];

  page.on('onResourceRequested', function (requestData, networkRequest) {
    try {
      var url = requestData.url || '';
      var lower = url.toLowerCase();

      var isBlockedType = blockedTypes.some(function (type) {
        return (
          lower.indexOf('.' + type) !== -1 ||
          lower.indexOf('?' + type + '=') !== -1
        );
      });

      var isBlockedDomain = blockedDomains.some(function (domain) {
        return url.indexOf(domain) !== -1;
      });

      if (isBlockedType || isBlockedDomain) {
        logger.debug && logger.debug('Blocking resource: ' + url);
        if (networkRequest && typeof networkRequest.abort === 'function') {
          networkRequest.abort();
        }
      }
    } catch (e) {
      logger.error &&
        logger.error(
          'Error in onResourceRequested handler: ' +
            (e && e.message ? e.message : e)
        );
    }
  });

  page.on('onError', function (msg, trace) {
    logger.error && logger.error('Page error: ' + msg);
    if (trace && trace.length) {
      var formatted = trace
        .map(function (t) {
          return '  at ' + t.file + ':' + t.line;
        })
        .join('\n');
      logger.error(formatted);
    }
  });
}

module.exports = {
  configure: configure,
};