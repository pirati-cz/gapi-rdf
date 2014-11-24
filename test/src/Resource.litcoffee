    require('source-map-support').install()
    chai = require 'chai'
    expect = chai.expect

    rdf = require '../..'
    Resource = rdf.Resource

    resource = null
    empty = null
    john = null
    jane = null
    jack = null

    describe "GAPI Resource", ->

      it "should create a new resource with empty graph", ->
        empty = rdf.createResource 'http://example.com/empty#test'
        expect(empty.toString()).to.equal ""

      it "should create Resource with existing graph", ->
        iri = 'http://example.com/page#resource'
        graph = do rdf.createGraph
        graph.add rdf.createTriple rdf.createNamedNode(iri), rdf.createNamedNode('http://www.w3.org/2000/01/rdf-schema#label'), rdf.createLiteral('resource label')
        resource = rdf.createResource iri, graph
        expect(resource.rdfs.label).to.equal 'resource label'

      it "should be able to detect Resource", ->
        expect(Resource.is_Resource empty).to.be.true
        expect(Resource.is_Resource resource).to.be.true

        expect(Resource.is_Resource "john").to.be.false
        expect(Resource.is_Resource 0).to.be.false
        expect(Resource.is_Resource undefined).to.be.false
        expect(Resource.is_Resource null).to.be.false
        expect(Resource.is_Resource rdf).to.be.false

      it "should be able to detect CURIE names", ->
        expect(Resource.is_CURIE 'rdf:type').to.be.true
        expect(Resource.is_CURIE 'foaf:Person').to.be.true
        expect(Resource.is_CURIE '').to.be.false
        expect(Resource.is_CURIE 'Person').to.be.false
        expect(Resource.is_CURIE 'http://example.com/empty#test').to.be.false
        expect(Resource.is_CURIE 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type').to.be.false

      it "should be able to detect IRI", ->
        expect(Resource.is_IRI 'rdf:type').to.be.false
        expect(Resource.is_IRI 'foaf:Person').to.be.false
        expect(Resource.is_IRI '').to.be.false
        expect(Resource.is_IRI 'Person').to.be.false
        expect(Resource.is_IRI 'http://example.com/empty#test').to.be.true
        expect(Resource.is_IRI 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type').to.be.true

      it "creates resource and adds rdf:type foaf:Person", ->
        john = rdf.createResource 'http://example.com/john#me'
        john.add 'rdf:type', 'foaf:Person'
        expect(john.toString()).to.equal "<http://example.com/john#me> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://xmlns.com/foaf/0.1/Person> .\n"

      it "add foaf:name", ->
        john.add 'foaf:name', 'John Doe'
        expect(john.toString()).to.equal "<http://example.com/john#me> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://xmlns.com/foaf/0.1/Person> .\n<http://example.com/john#me> <http://xmlns.com/foaf/0.1/name> \"John Doe\" .\n"

      it "get foaf:name should return the name", ->
        expect(john.get "foaf:name").to.equal "John Doe"
        expect(john.getAll "foaf:name").to.eql ["John Doe"]

      it "add another foaf:name", ->
        john.add 'foaf:name', 'Johny'
        expect(john.toString()).to.equal "<http://example.com/john#me> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://xmlns.com/foaf/0.1/Person> .\n<http://example.com/john#me> <http://xmlns.com/foaf/0.1/name> \"John Doe\" .\n<http://example.com/john#me> <http://xmlns.com/foaf/0.1/name> \"Johny\" .\n"

      it "get foaf:name should return array of names", ->
        expect(john.get 'foaf:name').to.eql ["John Doe", "Johny"]
        expect(john.getAll 'foaf:name').to.eql ["John Doe", "Johny"]

      it "create another resource", ->
        jane = rdf.createResource 'http://example.com/jane#id'
        jane.add 'rdf:type', 'foaf:Person'
        expect(jane.toString()).to.equal "<http://example.com/jane#id> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://xmlns.com/foaf/0.1/Person> .\n"

      it "john foaf:knows jane", ->
        john.add 'foaf:knows', jane
        expect(john.get 'foaf:knows').to.equal "http://example.com/jane#id"

      it "john.length should return length of it's graph", ->
        expect(john.length()).to.equal 4

      it "john.length(predicate) should return number of the predicate triples in it's graph", ->
        expect(john.length 'foaf:name').to.equal 2
        expect(john.length 'foaf:knows').to.equal 1
        expect(john.length 'rdf:type').to.equal 1
        expect(john.length 'foaf:mbox').to.equal 0

      it "remove(predicate, value) should remove the triple from it's graph", ->
        jack = rdf.createResource 'http://example.com/jack#'
        jack.add 'rdf:type', 'foaf:Person'
        jack.add 'foaf:nick', 'jackie'
        jack.add 'foaf:nick', 'wackie'
        jack.add 'foaf:mbox', 'jack@example.com'
        jack.add 'foaf:mbox', 'jack.doe@example.com'
        jack.add 'foaf:knows', john
        jack.add 'foaf:knows', jane
        expect(jack.length 'foaf:nick').to.equal 2
        jack.remove 'foaf:nick', 'jackie'
        expect(jack.get 'foaf:nick').to.equal 'wackie'

      it "remove(predicate) should remove all predicate triples from it's graph", ->
        expect(jack.length 'foaf:knows').to.equal 2
        jack.remove 'foaf:knows'
        expect(jack.length 'foaf:knows').to.equal 0

      it "replace(predicate, value) should remove all predicate triples from it's graph and add a new one", ->
        expect(jack.length 'foaf:mbox').to.equal 2
        jack.replace 'foaf:mbox', 'jackie@example.com'
        expect(jack.get 'foaf:mbox').to.equal 'jackie@example.com'

      it "harmony catchall getter", ->
        expect(jack.foaf.mbox).to.equal 'jackie@example.com'

      it "harmony catchall setter adds triple", ->
        jack.foaf.knows = john
        expect(jack.foaf.knows).to.equal 'http://example.com/john#me'

      it "harmony catchall setter adds another triple", ->
        jack.foaf.knows = jane
        expect(jack.foaf.knows).to.eql ['http://example.com/john#me', 'http://example.com/jane#id']
