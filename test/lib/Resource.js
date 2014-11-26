(function() {
  var Resource, chai, empty, env, expect, jack, jane, john, rdf, resource;

  require('source-map-support').install();

  chai = require('chai');

  expect = chai.expect;

  rdf = require('../..');

  Resource = rdf.Resource;

  env = rdf.environment;

  resource = null;

  empty = null;

  john = null;

  jane = null;

  jack = null;

  describe("GAPI Resource", function() {
    it("should create a new resource with empty graph", function() {
      empty = env.createResource('http://example.com/empty#test');
      return expect(empty.toString()).to.equal("");
    });
    it("should create Resource with existing graph", function() {
      var graph, iri;
      iri = 'http://example.com/page#resource';
      graph = env.createGraph();
      graph.add(env.createTriple(env.createNamedNode(iri), env.createNamedNode('http://www.w3.org/2000/01/rdf-schema#label'), env.createLiteral('resource label')));
      resource = env.createResource(iri, graph);
      return expect(resource.rdfs.label).to.equal('resource label');
    });
    it("should be able to detect Resource", function() {
      expect(Resource.is_Resource(empty)).to.be["true"];
      expect(Resource.is_Resource(resource)).to.be["true"];
      expect(Resource.is_Resource("john")).to.be["false"];
      expect(Resource.is_Resource(0)).to.be["false"];
      expect(Resource.is_Resource(void 0)).to.be["false"];
      expect(Resource.is_Resource(null)).to.be["false"];
      return expect(Resource.is_Resource(env)).to.be["false"];
    });
    it("should be able to detect CURIE names", function() {
      expect(Resource.is_CURIE('rdf:type')).to.be["true"];
      expect(Resource.is_CURIE('foaf:Person')).to.be["true"];
      expect(Resource.is_CURIE('')).to.be["false"];
      expect(Resource.is_CURIE('Person')).to.be["false"];
      expect(Resource.is_CURIE('http://example.com/empty#test')).to.be["false"];
      return expect(Resource.is_CURIE('http://www.w3.org/1999/02/22-rdf-syntax-ns#type')).to.be["false"];
    });
    it("should be able to detect IRI", function() {
      expect(Resource.is_IRI('rdf:type')).to.be["false"];
      expect(Resource.is_IRI('foaf:Person')).to.be["false"];
      expect(Resource.is_IRI('')).to.be["false"];
      expect(Resource.is_IRI('Person')).to.be["false"];
      expect(Resource.is_IRI('http://example.com/empty#test')).to.be["true"];
      return expect(Resource.is_IRI('http://www.w3.org/1999/02/22-rdf-syntax-ns#type')).to.be["true"];
    });
    it("creates resource and adds rdf:type foaf:Person", function() {
      john = env.createResource('http://example.com/john#me');
      john.add('rdf:type', 'foaf:Person');
      return expect(john.toString()).to.equal("<http://example.com/john#me> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://xmlns.com/foaf/0.1/Person> .\n");
    });
    it("add foaf:name", function() {
      john.add('foaf:name', 'John Doe');
      return expect(john.toString()).to.equal("<http://example.com/john#me> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://xmlns.com/foaf/0.1/Person> .\n<http://example.com/john#me> <http://xmlns.com/foaf/0.1/name> \"John Doe\" .\n");
    });
    it("get foaf:name should return the name", function() {
      expect(john.get("foaf:name")).to.equal("John Doe");
      return expect(john.getAll("foaf:name")).to.eql(["John Doe"]);
    });
    it("add another foaf:name", function() {
      john.add('foaf:name', 'Johny');
      return expect(john.toString()).to.equal("<http://example.com/john#me> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://xmlns.com/foaf/0.1/Person> .\n<http://example.com/john#me> <http://xmlns.com/foaf/0.1/name> \"John Doe\" .\n<http://example.com/john#me> <http://xmlns.com/foaf/0.1/name> \"Johny\" .\n");
    });
    it("get foaf:name should return array of names", function() {
      expect(john.get('foaf:name')).to.eql(["John Doe", "Johny"]);
      return expect(john.getAll('foaf:name')).to.eql(["John Doe", "Johny"]);
    });
    it("create another resource", function() {
      jane = env.createResource('http://example.com/jane#id');
      jane.add('rdf:type', 'foaf:Person');
      return expect(jane.toString()).to.equal("<http://example.com/jane#id> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://xmlns.com/foaf/0.1/Person> .\n");
    });
    it("john foaf:knows jane", function() {
      john.add('foaf:knows', jane);
      return expect(john.get('foaf:knows')).to.equal("http://example.com/jane#id");
    });
    it("john.length should return length of it's graph", function() {
      return expect(john.length()).to.equal(4);
    });
    it("john.length(predicate) should return number of the predicate triples in it's graph", function() {
      expect(john.length('foaf:name')).to.equal(2);
      expect(john.length('foaf:knows')).to.equal(1);
      expect(john.length('rdf:type')).to.equal(1);
      return expect(john.length('foaf:mbox')).to.equal(0);
    });
    it("remove(predicate, value) should remove the triple from it's graph", function() {
      jack = env.createResource('http://example.com/jack#');
      jack.add('rdf:type', 'foaf:Person');
      jack.add('foaf:nick', 'jackie');
      jack.add('foaf:nick', 'wackie');
      jack.add('foaf:mbox', 'jack@example.com');
      jack.add('foaf:mbox', 'jack.doe@example.com');
      jack.add('foaf:knows', john);
      jack.add('foaf:knows', jane);
      expect(jack.length('foaf:nick')).to.equal(2);
      jack.remove('foaf:nick', 'jackie');
      return expect(jack.get('foaf:nick')).to.equal('wackie');
    });
    it("remove(predicate) should remove all predicate triples from it's graph", function() {
      expect(jack.length('foaf:knows')).to.equal(2);
      jack.remove('foaf:knows');
      return expect(jack.length('foaf:knows')).to.equal(0);
    });
    it("replace(predicate, value) should remove all predicate triples from it's graph and add a new one", function() {
      expect(jack.length('foaf:mbox')).to.equal(2);
      jack.replace('foaf:mbox', 'jackie@example.com');
      return expect(jack.get('foaf:mbox')).to.equal('jackie@example.com');
    });
    it("harmony catchall getter", function() {
      return expect(jack.foaf.mbox).to.equal('jackie@example.com');
    });
    it("harmony catchall setter adds triple", function() {
      jack.foaf.knows = john;
      return expect(jack.foaf.knows).to.equal('http://example.com/john#me');
    });
    return it("harmony catchall setter adds another triple", function() {
      jack.foaf.knows = jane;
      return expect(jack.foaf.knows).to.eql(['http://example.com/john#me', 'http://example.com/jane#id']);
    });
  });

  describe("GAPI ClassMap", function() {
    it("should set new mapping", function() {
      var Person;
      Person = (function() {
        function Person() {}

        Person.prototype.upperCasedName = function() {
          var name, _i, _len, _ref, _results;
          _ref = this.getAll('foaf:name');
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            name = _ref[_i];
            _results.push(name.toUpperCase());
          }
          return _results;
        };

        return Person;

      })();
      env.setClass('foaf:Person', Person);
      return expect(env.getClass('foaf:Person')).to.be.eql(Person);
    });
    return it("should call mapped class function", function() {
      return expect(john.foaf.upperCasedName()).to.be.eql(["JOHN DOE", "JOHNY"]);
    });
  });

}).call(this);

//# sourceMappingURL=sourcemaps/Resource.js.map