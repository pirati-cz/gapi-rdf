    rdf = require './interfaces'
    Resource = require './Resource'

    rdf.Resource = Resource
    rdf.createResource = (iri, graph) ->
      return new Resource iri, graph, this

    module.exports = rdf