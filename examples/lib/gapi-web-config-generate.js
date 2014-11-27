(function() {
  var rdf, rdfi, web;

  rdfi = require('../..');

  rdfi.use(rdfi.extensions.Resource);

  rdf = rdfi.environment;

  rdf.setPrefix('gapi', 'http://graphapi.ga/ns/gapi#');

  rdf.setPrefix('gs', 'http://graphapi.ga/ns/gapi-servers#');

  web = rdf.createResource('http://example.com/');

  web.rdf.type = 'gs:WebServer';

  web.gs.listenPort = '80';

  web.gs.protocol = 'gs:http';

  console.log(web.toString());

}).call(this);

//# sourceMappingURL=sourcemaps/gapi-web-config-generate.js.map