gapi-rdf
========

**Only for experimental purposes!**

This is a release of an unstable prototype version of GAPI RDF library. It's not tested in production at all.


Requirements
------------

Since the library uses Harmony proxies you need to execute Node.js with the `--harmony` runtime option:
```
    node --harmony script_using_gapi-rdf.js
```

When you see `Error: proxies not supported on this platform`, you've probably forgotten to add the option.


Classes
-------
 * ClassMap - map of a class to rdf:type
 * Resource - subject-centered rdf-interfaces' graph wrapper (ORM)


RDF Interfaces
--------------

GAPI RDF uses Acubed's [node-rdf](https://github.com/Acubed/node-rdf) - implementation of RDF Interfaces (npm package `rdf`).

RDF Interface library is extended by classes: `Resource` and `ClassMap`.
Its `Profile` is extended by methods: `getClass()`, `setClass()` and `setDefaultClass`.
Its `RDFEnvrionment` is extended by methods: `createResource()` and `createClassMap()`


Docs
----

Docco generated documentation: [docco docs](https://github.com/pirati-cz/gapi-rdf/tree/master/docs/docco)


Usage
-----

For the usage see [Resource test](https://github.com/pirati-cz/gapi-rdf/blob/master/test/src/Resource.litcoffee)

Examples: [examples](https://github.com/pirati-cz/gapi-rdf/tree/master/examples)

TODO
----

See [issues](https://github.com/pirati-cz/gapi-rdf/issues).


**Milestone v1.0.0-alpha**

* ResourceMap - for caching resources inside the RDFEnvironment
* Blank Nodes
* Populate and lazy populate
* Persistence - bind Resource to a store + save()
* Persistence auto-save mode - save() on every change

**optionally later**

* domain, range, cardinality... constraining
