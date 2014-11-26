Simple loader of rdf-interfaces and rdf-ext mixin which is then used as a base object for other GAPI classes and objects.

    rdf = require 'rdf'

    # patch not implemented method
    rdf.Graph.prototype.removeMatches = (s, p, o) ->
      @match(s, p, o).forEach (t) =>
        @remove t

    require('rdf-ext')(rdf.RDFEnvironment.prototype)
    module.exports = rdf