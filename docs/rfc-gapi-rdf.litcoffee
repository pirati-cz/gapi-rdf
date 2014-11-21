GAPI RDF library Request for comments
=====================================

*November 2014*

*"Tomáš `klip` Klapka", <tomas.klapka@pirati.cz>*

This is an usage overview with examples of `gapi-rdf` JavaScript library (written in CoffeeScript) containing rdf-interfaces, universal Parser, Serializer and ORM-like wrapper for a RDF resource and it's graph.

Most of it is already implemented as a prototype (alpha version) and before publishing the library I would like to request for comments on library's api, architecture, names, nonsenses, etc. I'll take all comments seriously and I'll try to refactor the code and it's tests before the initial release.

What is GAPI?
-------------

GAPI is a short for Graph API.

GAPI is a `public domain` project initiated by several pirates from Czech Pirate Party.

GAPI is supposed to be a JavaScript Semantic Web Stack with a pluginnable SPARQL-endpoint proxy and a Web server with a REST API.

`gapi-rdf` module is supposed to be a common part of GAPI but usable also separately. It's aiming to simplify processing of RDF data in JavaScript. We are trying to reuse other libraries and modules and provide general programmatical API with a higher level than is provided by low-level rdf-interfaces/rdf-ext implementations.


What is implemented?
--------------------

* GAPI main class
* Parser
* Namespace
* almost all of the Resource class
* simple Parser HTTP request caching of HTTP responses


TODO and thoughts
-----------------

not only to implement, but also to specify programmatical api

* how to treat and return errors? (research best JS practices)
* blank nodes (blank resource?)
* lazy fetching of resources?
* constraining domain, range, cardinality... (ORM strict mode?)
* add Namespace without loading it's data (ie. just for aliasing it's name)
* Namespace split into Namespace and Ontology? (separate aliasing of any namespaces and ORM required ontology data)
* GAPI Parser - include more parsers from various modules and allow to add (replace) own parser anytime later for any MIME type programmatically
* GAPI Serializer - serialize rdf-interfaces' graph to various formats
* GAPI Storage (wrapper for rdf-ext stores?)
* ResourcesList? to simplify working with set of resources
* reasoning? (idea is that it might be very helpful for the ORM part)
* model methods - bind a class with static methods to a RDF type and call these methods by the Resource catchall handler
* `alias` vs. `prefix`?

GAPI RDF library
================

Usage
-----

GAPI RDF uses *harmony proxies* to handle catchall getters and setters for resource ORM. To enable harmony proxies, you need to run `node` with `--harmony` command line option.

```bash
node --harmony example
```

If you are not going to use Namespace and Resource classes and you don't need to instantiate GAPI, ie. you are going to use only it's interfaces, Parser and Serializer classes, then harmony proxies are not required.


    GAPI = require 'gapi-rdf'


Get rdf-interfaces/rdf-ext mixin, Parser and Serializer modules

    rdf = GAPI.interfaces
    Parser = GAPI.Parser
    Serializer = GAPI.Serializer


ORM
---

Instantiate GAPI for ORM operations. Each gapi instance has it's own list of namespaces, it's aliases and resources.
Default namespaces are: rdf, rdfs and owl

    gapi = new GAPI()

You can instantiate GAPI with additional namespaces

    gapi_with_foaf_and_sioc = new GAPI {
      namespaces:
        'foaf': 'http://xmlns.com/foaf/0.1/'
        'sioc': 'http://rdfs.org/sioc/ns#'
    }

Get GAPI's Resource and Namespace classes from GAPI's instance `gapi` since they are bound together.

    Resource = gapi.Resource
    Namespace = gapi.Namespace


Later if you need the `gapi` instance, you can simply get it from `Resource.gapi` or `Namespace.gapi` static properties.
`gapi` instance injects itself into `gapi.Namespace` and `gapi.Resource` classes as static property to joint all pieces together.

    gapi.Resource.gapi == gapi  # true
    gapi.Namespace.gapi == gapi # true

You can get it from instantiated namespaces and resources as well.

    gapi = anInstanceOfResource.gapi
    gapi = anInstanceOfNamespace.gapi

Wait for GAPI to load it's default/configured Namespaces and its Resources.

`init()` initiates loading, creates a `promise` and returns `this`.
Then `and` contains `this`, `then()` calls `promise.then()`.

    gapi.init().then (gapi) ->
    gapi.init().and.then (gapi) ->
    gapi.init().and.promise.then (gapi) ->
    (gapi = new GAPI()).init().then (gapi) ->
    (gapi = new GAPI()).init().and.then (gapi) ->


Namespace
=========

Namespace class sets the alias for a namespace and also it loads it's data.

Creating and Loading
--------------------

Get Namespace class from gapi instance

      Namespace = gapi.Namespace

Create FOAF namespace

      foaf = new Namespace 'foaf', 'http://xmlns.com/foaf/0.1/'


Namespace instance keeps `gapi` instance so you don't have to pass it around

      
      gapi = foaf.gapi


Namespace alias and uri are in their properties

      console.log "#{foaf.alias} for #{foaf.uri}"


Loading namespace data

      foaf.init().then (foaf) ->
      foaf.init().and.then (foaf) ->
      foaf.init().and.promise.then (foaf) ->
      (foaf = new Namespace('foaf', 'http://xmlns.com/foaf/0.1/')).init().then (foaf) ->
      (foaf = new Namespace('foaf', 'http://xmlns.com/foaf/0.1/')).and.init().and.then (foaf) ->


Later you can get your namespace instance (if needed) by calling `ns(ns_alias)` or `namespace(ns_alias)`.
These methods are available as instance methods at `gapi` object and class methods at `gapi.Namespace` class

        foaf = gapi.ns 'foaf'
        foaf = gapi.namespace 'foaf'
        foaf = Namespace.ns 'foaf'
        foaf = Namespace.namespace 'foaf'


Namespace classes, properties and resources
-------------------------------------------

You can list namespace classes, properties, and all its resources. Returns string array with names of the required type of data as default.
All of them returns short resource names as default since they are all from the namespace.

        foaf.getClasses()
        foaf.getProperties()
        foaf.getResources()


You can pass options object where you can specify format of resource names returned and also type of returned data:

`nameFormat` can be `GAPI.SHORT`, `GAPI.ALIAS` or `GAPI.FULL` (or just use 'short', 'alias', 'full')
`returnType` can be `GAPI.NAMES`, `GAPI.RESOURCES` or `GAPI.ALL` (or just use 'names', 'resources', 'all')

Or take it from GAPI's instance `gapi.SHORT`, `gapi.ALIAS`, `gapi.FULL`, `gapi.NAMES`, `gapi.RESOURCES`, `gapi.ALL`.

        foaf.getClasses { nameFormat: GAPI.FULL, returnType: GAPI.ALL }


Short names (default options):
```
[ 'LabelProperty', 'Person', 'Agent', ... ]
```

        short_names_options =
          nameFormat: GAPI.SHORT
          returnType: GAPI.NAMES

For aliased names with resources as values:
```
{ 'foaf:LabelProperty': { uri: 'http://xmlns.com/foaf/0.1/LabelProperty', graph: ... }, ... }

```

        aliased_names_with_values_options =
          nameFormat: GAPI.ALIAS
          returnType: GAPI.ALL

For aliased names with resources as values:
```
[ { uri: 'http://xmlns.com/foaf/0.1/LabelProperty', graph: ... }, ... ]

```

        only_resources_array_options =
          returnType: GAPI.RESOURCES

Full names:
```
[ 'http://xmlns.com/foaf/0.1/LabelProperty', 'http://xmlns.com/foaf/0.1/Person', ... ]
```

        full_names_options =
          nameFormat: GAPI.FULL
          returnType: GAPI.NAMES


You can get namespace class, property or resource by it's `name`.
You can use various name formats and they should be auto-detected.
It returns the resource instance.

        foaf.getClass 'Document'
        foaf.getProperty 'foaf:knows'
        foaf.getResource 'http://xmlns.com/foaf/0.1/mbox'


Classes and properties are resources too, so there is `getResource()` alias `get()`

        foaf.get 'http://xmlns.com/foaf/0.1/age'


You are also safe to use short resourceNames as namespace instance properties since catchall getter passes all not existing properties to foaf.get(unknownPropertyName)

        foaf.Person  # Person is not a property so it calls foaf.get "http://xmlns.com/foaf/0.1/Person"
        foaf.knows   # calls foaf.get "http://xmlns.com/foaf/0.1/knows"



Resource
========

Resource class wraps rdf-interfaces' graph and provides ORM-like access.


Creating and Loading
--------------------

Get Resource class from gapi instance

      Resource = gapi.Resource

Create a new resource and add <resource_uri> <rdf:type> <foaf:Person> triple into it's graph and logs graph to console.

        john = new Resource 'http://example.com/people/John_Doe#me'
        john.rdf.type = foaf.Person
        console.log john.toString()


Shorter version when you need to specify type of a resource

        jane = new Resource 'http://example.com/people/Jane_Doe#me', foaf.Person


Pick a single resource from url, file or graph

        Resource.from('http://example.com/people/Jason_Doe#me').then (jason) ->
          console.log jason.toString()

        Resource.from('./Jason_Doe.ttl', 'http://example.com/people/Jason_Doe#me').then (jason) ->
          console.log jason.toString()

        Resource.from(graph, 'http://example.com/people/Jason_Doe#me').then (jason) ->
          console.log jason.toString()


Load all resources from url, file or graph. Returns object with keys as fullNames of resources and values as resource instances

        Resource.allFrom('http://example.com/people/Jason_Doe#').then (resources) -> 
          console.log resources.length

        Resource.allFrom('./Jason_Doe.ttl', 'http://example.com/people/Jason_Doe#').then (resources) ->
          console.log resources.length

        Resource.allFrom(graph, 'http://example.com/people/Jason_Doe#').then (resources) ->
          console.log resources.length


Adding statements
-----------------

        john.foaf.name = "John Doe"
        john.foaf.name = "Johnny Doe"
        john.foaf.mbox = "john.doe@example.com"
        john.foaf.knows = jane
        john.foaf.knows = jason
        john.foaf.knows = 'http://example.com/people/Jack_Doe#me'
        jane.foaf.mbox = "jane.doe@example.com"
        jane.foaf.mbox = "jane.doe@other.example.com"
        jane.foaf.knows = jason
        jason.foaf.knows = 'http://example.com/people/John_Doe#me'
        jason.foaf.nick = ['jassa', 'baby']

or you can use `add` method:

        john.add foaf.homepage, "http://jason.doe.example.com/"


Getting statements
------------------

        john_name = john.foaf.name            # [ "John Doe", "Johnny Doe" ]
        john_mbox = john.foaf.mbox            # "john.doe@example.com"
        john_knows = john.foaf.knows          # [ jane, jason, jack ]
        jane_mbox = jane.foaf.mbox            # [ "jane.doe@example.com", "jane.doe@other.example.com" ]
        jane_knows = jane.foaf.knows          # jason
        jane_knows = jane.all foaf.knows      # [ jason ] ie. always return array
        jason_nick = jason.foaf.nick          # [ "jassa", "baby" ]

        john_knows_first = john.first foaf.knows    # jane
        john_knows_rest = john.rest foaf.knows      # [ jason, jack ] always array
        john_knows_last = john.last foaf.knows      # jack

        john_knows_count = john.count foaf.knows    # 2
        john_knows_count = john.length foaf.knows   # 2

or you can use `get*()` methods:

        john.get foaf.knows
        john.getFirst foaf.knows
        john.getRest foaf.knows
        john.getAll foaf.knows
        john.getLast foaf.knows
        john.getCount foaf.knows
        john.getLength foaf.knows


Removing statements
-------------------

        jane.remove foaf.knows
        jane.remove "foaf:knows"
        jane.remove "http://xmlns.com/foaf/0.1/knows"


Removing known statements
-------------------------

        jane.remove foaf.mbox, [ "jane.doe@example.com", "jane.doe@other.example.com" ]
        jason.remove foaf.nick, 'baby'
        john.remove foaf.knows, 'http://example.com/people/Jason_Doe#me'


Replacing statements
--------------------

        john.remove foaf.name
        john.foaf.name = "John Adalbert Doe" 

`replace` is a shorter version

        john.replace foaf.name, "John Adalbert Doe"


Accessing resource's graph
--------------------------

You can access resource's graph (rdf-interfaces graph)

        john_and_jane_graph = john.graph.merge jane.graph


Parser
======

    Parser = require('gapi-rdf').Parser

    Parser.loadFile('data.ttl').then (content, mime) ->
    Parser.download('http://example.com/data.ttl').then (content, mime) ->

    Parser.parse(content, mime, base).then (graph) ->

    Parser.fetch('data.ttl', base).then (graph) ->
    Parser.fetch('http://example.com/data.rdf').then (graph) ->


