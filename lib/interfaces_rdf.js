(function() {
  var rdf;

  rdf = require('rdf');

  rdf.Graph.prototype.removeMatches = function(s, p, o) {
    return this.match(s, p, o).forEach((function(_this) {
      return function(t) {
        return _this.remove(t);
      };
    })(this));
  };

  require('rdf-ext')(rdf.RDFEnvironment.prototype);

  module.exports = rdf;

}).call(this);

//# sourceMappingURL=sourcemaps/interfaces_rdf.js.map