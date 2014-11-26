(function() {
  var RDFEnvironment, Reflect, Resource, ResourceNamespaceProxy, ResourceNamespaceProxyHandler, ResourceProxyHandler, dbg, __get, __set;

  Reflect = require('harmony-reflect');

  Resource = (function() {
    Resource.environment = null;

    function Resource(iri, graph, environment) {
      this.iri = iri;
      this.graph = graph;
      this.environment = environment;
      if ((this.environment != null) && (Resource.environment == null)) {
        Resource.environment = this.environment;
      } else if ((this.environment == null) && (Resource.environment != null)) {
        this.environment = Resource.environment;
      }
      if (this.environment == null) {
        throw new Error("Please provide an RDFEnvironment instance when instantiating a Resource");
      }
      this.subject = this.environment.createNamedNode(this.iri);
      if (this.graph == null) {
        this.graph = this.environment.createGraph();
      }
      return new Proxy(this, ResourceProxyHandler);
    }

    Resource.prototype._resolve = function(input) {
      if (Resource.is_Resource(input)) {
        return input.subject;
      }
      if (Resource.is_CURIE(input)) {
        input = this.environment.resolve(input);
      }
      if (Resource.is_IRI(input)) {
        return this.environment.createNamedNode(input);
      }
      return this.environment.createLiteral(input);
    };

    Resource.prototype._shrink = function(input) {
      var value;
      value = input.nominalValue;
      if (Resource.is_IRI(value)) {
        return this.environment.shrink(value);
      }
      return value;
    };

    Resource.prototype.add = function(predicate, object) {
      var triple;
      triple = this.environment.createTriple(this.subject, this._resolve(predicate), this._resolve(object));
      this.graph.add(triple);
      return this;
    };

    Resource.prototype.getAll = function(predicate) {
      var objects;
      objects = [];
      this.graph.match(this.subject, this._resolve(predicate)).forEach((function(_this) {
        return function(t) {
          return objects.push(_this._shrink(t.object));
        };
      })(this));
      return objects;
    };

    Resource.prototype.get = function(predicate) {
      var objects;
      objects = this.getAll(predicate);
      switch (objects.length) {
        case 0:
          return void 0;
        case 1:
          return objects[0];
        default:
          return objects;
      }
    };

    Resource.prototype.length = function(predicate) {
      if (predicate != null) {
        return (this.getAll(predicate)).length;
      }
      return this.graph.length;
    };

    Resource.prototype.remove = function(predicate, object) {
      var o;
      o = object != null ? this._resolve(object) : null;
      this.graph.removeMatches(this.subject, this._resolve(predicate), o);
      return this;
    };

    Resource.prototype.replace = function(predicate, object) {
      this.remove(predicate);
      return this.add(predicate, object);
    };

    Resource.prototype.toString = function() {
      return this.graph.toString();
    };

    Resource.prototype.resolveClassCall = function(prefix, method) {
      var fn, handling_class, rdf_type, type_prefix, types, _i, _len;
      dbg("resolveClassCall '" + prefix + "':'" + method + "'()");
      types = this.getAll('rdf:type');
      for (_i = 0, _len = types.length; _i < _len; _i++) {
        rdf_type = types[_i];
        type_prefix = rdf_type.split(/:/)[0];
        if (prefix === type_prefix) {
          handling_class = this.environment.getClass(rdf_type);
          if ((handling_class != null) && (handling_class.prototype[method] != null)) {
            fn = handling_class.prototype[method];
            dbg("resolveClassCall \tbinding call");
            return fn.bind(this);
          }
        }
      }
      dbg("resolveClassCall \tundefined");
      return void 0;
    };

    Resource.is_CURIE = function(name) {
      return /:[^\/][^\/]/.test(name);
    };

    Resource.is_IRI = function(name) {
      return /:\/\//.test(name);
    };

    Resource.is_Resource = function(object) {
      if (typeof object === 'string') {
        return false;
      }
      if ((object != null) && (object.subject != null) && (object.iri != null)) {
        return true;
      }
      return false;
    };

    Resource.dbg = function(msg) {};

    Resource.prototype.dbg = function(msg) {
      return Resource.dbg(msg);
    };

    return Resource;

  })();

  dbg = function(msg) {
    return Resource.dbg(msg);
  };

  __get = function(target, name, reciever) {
    return Reflect.get(target, name, reciever);
  };

  __set = function(target, name, value) {
    return Reflect.set(target, name, value);
  };

  ResourceProxyHandler = {
    get: function(target, name, reciever) {
      if (name in target) {
          return __get(target, name);
        };
      var environment, ns, proxy;
      dbg("HARMONY - resource catchall getter getting '" + name + "' from resource");
      environment = __get(target, 'environment');
      ns = environment.resolve(name + ':');
      dbg("HARMONY - resource catchall getter namespace: " + ns);
      if (ns == null) {
        return __get(target, name);
      }
      proxy = new ResourceNamespaceProxy(target, name);
      __set(target, name, proxy);
      return proxy;
    }
  };

  ResourceNamespaceProxyHandler = {
    get: function(target, name, reciever) {
      var classCall, environment, prefix, resource;
      dbg("HARMONY - ResourceNamespaceProxyHandler catchall getter getting '" + name + "' from resource's graph");
      prefix = __get(target, 'prefix');
      resource = __get(target, 'resource');
      environment = __get(resource, 'environment');
      classCall = resource.resolveClassCall(prefix, name);
      if (classCall != null) {
        return classCall;
      }
      return __get(target, 'resource').get(prefix + ':' + name);
    },
    set: function(target, name, value, reciever) {
      dbg("HARMONY - ResourceNamespaceProxyHandler catchall setter setting '" + name + "' with '" + value + "' into resource's graph");
      return __get(target, 'resource').add(__get(target, 'prefix') + ':' + name, value);
    }
  };

  ResourceNamespaceProxy = (function() {
    function ResourceNamespaceProxy(resource, prefix) {
      this.resource = resource;
      this.prefix = prefix;
      dbg("HARMONY - new ResourceNamespaceHandler for " + this.resource.iri + " and ns prefix " + this.prefix);
      return new Proxy(this, ResourceNamespaceProxyHandler);
    }

    return ResourceNamespaceProxy;

  })();

  RDFEnvironment = (function() {
    function RDFEnvironment() {}

    RDFEnvironment.prototype.createResource = function(iri, graph) {
      return new Resource(iri, graph, this);
    };

    return RDFEnvironment;

  })();

  module.exports = {
    Resource: Resource,
    RDFEnvironment: RDFEnvironment
  };

}).call(this);

//# sourceMappingURL=sourcemaps/Resource.js.map