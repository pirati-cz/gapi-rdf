gapi-rdf
========

**Only for experimental purposes!**

This is a release of an unstable prototype version of GAPI RDF library. It's not tested in production at all.

 * `docs/docco` - generated docs from Literate CoffeeScript and MD
 * `**/src` - CoffeeScript source files.
 * `**/lib` - JavaScript files compiled from CoffeeScript.

Requirements
------------

Since the library uses Harmony proxies you need to execute Node.js with the `--harmony` runtime option:
```
    node --harmony examples/lib/gapi-web-config-generate.js
```

When you see `Error: proxies not supported on this platform`, you've probably forgotten to add the option.


RDF Interfaces
--------------

For the present GAPI RDF is being developed and tested with Acubed's [node-rdf](https://github.com/Acubed/node-rdf) (npm package `rdf`). Later, it should be possible to switch implementations.

GAPI RDF also extends the interface by `rdf-ext` from bergos.


RDF Interfaces Extender
-----------------------

GAPI RDF works also as a general extender of the underlying implementation of RDF Interfaces.

There is an added method `use()` for extensions to be loaded into interface

`use()` takes object where it searches for 'RDFInterfacesExtMap' property where should be a mapping of the extension.

See [ClassMap](https://github.com/pirati-cz/gapi-rdf/blob/master/src/ClassMap.litcoffee) or [Resource](https://github.com/pirati-cz/gapi-rdf/blob/master/src/Resource.litcoffee) source files for simple mapping examples.


Extensions
----------

GAPI RDF contains two usable extensions: Resource and ClassMap. Both can be used standalone, though ClassMap has no other functionality than manipulation of the class map.


**Resource**

subject-oriented ORM wrapper of interfaces' *graph*

```
  rdf = require 'gapi-rdf'
  rdf.use rdf.extensions.Resource
```

Adds:
 * `Resource` class
 * `createResource(iri, graph)` to `RDFEnvironment`


**ClassMap**

RDFEnvironment map for mapping JS classes to rdf:types. Enables calling class methods on the Resource instance if one of its rdf:types matches the mapping, ie. Resource extension uses this map to find methods to bind and call.

```
  rdf = require 'gapi-rdf'
  rdf.use rdf.extensions.ClassMap
```

Adds:
 * `ClassMap` class
 * method `createClassMap(classMap)` to `RDFEnvironment`
 * methods `getClass(rdf_type)`,
 * `setClass(rdf_type, handling_class)` and
 * `setDefaultClass(handling_class)` to `Profile`


Docs
----

Docco generated documentation: [docco docs](https://github.com/pirati-cz/gapi-rdf/tree/master/docs/docco)


Usage
-----

For the usage see [Resource test](https://github.com/pirati-cz/gapi-rdf/blob/master/test/src/Resource.litcoffee)

Or see [examples](https://github.com/pirati-cz/gapi-rdf/tree/master/examples)


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
