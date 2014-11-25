Simple loader of rdf-interfaces and rdf-ext mixin which is then used as a base object for other GAPI classes and objects.

    rdf = require 'rdf'
    require('rdf-ext')(rdf.RDFEnvironment.prototype)
    module.exports = rdf