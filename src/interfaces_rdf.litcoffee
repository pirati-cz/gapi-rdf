Load Acubed's node-rdf with rdf-ext

    rdf = require 'rdf'

    # patch not implemented method
    rdf.Graph.prototype.removeMatches = (s, p, o) ->
      @match(s, p, o).forEach (t) =>
        @remove t

    require('rdf-ext')(rdf.RDFEnvironment.prototype)
    module.exports = rdf