How to run this example?
```
node --harmony examples/lib/gapi-web-config-generate
```

This example just loads default GAPI RDF environment

	rdf = require('../..').environment

adds prefixes

	rdf.setPrefix 'gapi', 'http://graphapi.ga/ns/gapi#'
	rdf.setPrefix 'gs', 'http://graphapi.ga/ns/gapi-servers#'

creates a resource

	web = rdf.createResource 'http://example.com/'

adds several triples

	web.rdf.type = 'gs:WebServer'
	web.gs.listenPort = '80'
	web.gs.protocol = 'gs:http'

and writes resource's graph in turtle to stdout

	console.log web.toString()
    