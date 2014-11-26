(function() {
  var cm, rdf, resource;

  rdf = require('./interfaces');

  cm = require('./ClassMap');

  rdf.ClassMap = cm.ClassMap;

  rdf.RDFEnvironment.prototype.createClassMap = cm.RDFEnvironment.prototype.createClassMap;

  rdf.Profile.prototype.getClass = cm.Profile.prototype.getClass;

  rdf.Profile.prototype.setClass = cm.Profile.prototype.setClass;

  rdf.Profile.prototype.setDefaultClass = cm.Profile.prototype.setDefaultClass;

  resource = require('./Resource');

  rdf.Resource = resource.Resource;

  rdf.RDFEnvironment.prototype.createResource = resource.RDFEnvironment.prototype.createResource;

  module.exports = rdf;

}).call(this);

//# sourceMappingURL=sourcemaps/index.js.map