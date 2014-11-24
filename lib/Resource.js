(function() {
  var Reflect, Resource, ResourceNamespaceProxy, ResourceNamespaceProxyHandler, ResourceProxyHandler, dbg, __get, __set;

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
      dbg("HARMONY - ResourceNamespaceProxyHandler catchall getter getting '" + name + "' from resource's graph");
      return __get(target, 'resource').get(__get(target, 'prefix') + ':' + name);
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

  module.exports = Resource;

}).call(this);

//# sourceMappingURL=data:application/json;base64,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SUFBL0IsQ0FaWixDQUFBO0FBQUEsTUFhQSxLQUFBLENBQU0sTUFBTixFQUFjLElBQWQsRUFBb0IsS0FBcEIsQ0FiQSxDQUFBO2FBY0EsTUFoQkc7SUFBQSxDQUFMO0dBdEdGLENBQUE7O0FBQUEsRUF5SEEsNkJBQUEsR0FDRTtBQUFBLElBQUEsR0FBQSxFQUFLLFNBQUMsTUFBRCxFQUFTLElBQVQsRUFBZSxRQUFmLEdBQUE7QUFDSCxNQUFBLEdBQUEsQ0FBSyxtRUFBQSxHQUFtRSxJQUFuRSxHQUF3RSx5QkFBN0UsQ0FBQSxDQUFBO2FBQ0EsS0FBQSxDQUFNLE1BQU4sRUFBYyxVQUFkLENBQXlCLENBQUMsR0FBMUIsQ0FBOEIsS0FBQSxDQUFNLE1BQU4sRUFBYyxRQUFkLENBQUEsR0FBd0IsR0FBeEIsR0FBNEIsSUFBMUQsRUFGRztJQUFBLENBQUw7QUFBQSxJQUdBLEdBQUEsRUFBSyxTQUFDLE1BQUQsRUFBUyxJQUFULEVBQWUsS0FBZixFQUFzQixRQUF0QixHQUFBO0FBQ0gsTUFBQSxHQUFBLENBQUssbUVBQUEsR0FBbUUsSUFBbkUsR0FBd0UsVUFBeEUsR0FBa0YsS0FBbEYsR0FBd0YseUJBQTdGLENBQUEsQ0FBQTthQUNBLEtBQUEsQ0FBTSxNQUFOLEVBQWMsVUFBZCxDQUF5QixDQUFDLEdBQTFCLENBQThCLEtBQUEsQ0FBTSxNQUFOLEVBQWMsUUFBZCxDQUFBLEdBQXdCLEdBQXhCLEdBQTRCLElBQTFELEVBQWdFLEtBQWhFLEVBRkc7SUFBQSxDQUhMO0dBMUhGLENBQUE7O0FBQUEsRUFrSU07QUFDUyxJQUFBLGdDQUFFLFFBQUYsRUFBYSxNQUFiLEdBQUE7QUFDWCxNQURZLElBQUMsQ0FBQSxXQUFBLFFBQ2IsQ0FBQTtBQUFBLE1BRHVCLElBQUMsQ0FBQSxTQUFBLE1BQ3hCLENBQUE7QUFBQSxNQUFBLEdBQUEsQ0FBSyw2Q0FBQSxHQUE2QyxJQUFDLENBQUEsUUFBUSxDQUFDLEdBQXZELEdBQTJELGlCQUEzRCxHQUE0RSxJQUFDLENBQUEsTUFBbEYsQ0FBQSxDQUFBO0FBQ0EsYUFBVyxJQUFBLEtBQUEsQ0FBTSxJQUFOLEVBQVksNkJBQVosQ0FBWCxDQUZXO0lBQUEsQ0FBYjs7a0NBQUE7O01BbklGLENBQUE7O0FBQUEsRUF3SUEsTUFBTSxDQUFDLE9BQVAsR0FBaUIsUUF4SWpCLENBQUE7QUFBQSIsImZpbGUiOiJSZXNvdXJjZS5qcyIsInNvdXJjZVJvb3QiOiIvaG9tZS9sdWJ1bnR1L3B1Ymxpc2gvZ2FwaS1yZGYvc3JjIn0=