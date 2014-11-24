Simple loader of rdf-interfaces and rdf-ext mixin which is then used as a base object for other GAPI classes and objects.

    rdf = require 'rdf'
    rdf_ext = require 'rdf-ext'
    rdf_ext rdf.environment
    module.exports = rdf.environment