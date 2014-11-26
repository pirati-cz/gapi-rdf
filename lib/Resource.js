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

//# sourceMappingURL=data:application/json;base64,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QUVBLE1BQUEsR0FBUyxLQUFBLENBQU0sTUFBTixFQUFjLFFBQWQsQ0FGVCxDQUFBO0FBQUEsTUFHQSxRQUFBLEdBQVcsS0FBQSxDQUFNLE1BQU4sRUFBYyxVQUFkLENBSFgsQ0FBQTtBQUFBLE1BSUEsV0FBQSxHQUFjLEtBQUEsQ0FBTSxRQUFOLEVBQWdCLGFBQWhCLENBSmQsQ0FBQTtBQUFBLE1BS0EsU0FBQSxHQUFZLFFBQVEsQ0FBQyxnQkFBVCxDQUEwQixNQUExQixFQUFrQyxJQUFsQyxDQUxaLENBQUE7QUFNQSxNQUFBLElBQW9CLGlCQUFwQjtBQUFBLGVBQU8sU0FBUCxDQUFBO09BTkE7YUFRQSxLQUFBLENBQU0sTUFBTixFQUFjLFVBQWQsQ0FBeUIsQ0FBQyxHQUExQixDQUE4QixNQUFBLEdBQU8sR0FBUCxHQUFXLElBQXpDLEVBVEc7SUFBQSxDQUFMO0FBQUEsSUFXQSxHQUFBLEVBQUssU0FBQyxNQUFELEVBQVMsSUFBVCxFQUFlLEtBQWYsRUFBc0IsUUFBdEIsR0FBQTtBQUNILE1BQUEsR0FBQSxDQUFLLG1FQUFBLEdBQW1FLElBQW5FLEdBQXdFLFVBQXhFLEdBQWtGLEtBQWxGLEdBQXdGLHlCQUE3RixDQUFBLENBQUE7YUFDQSxLQUFBLENBQU0sTUFBTixFQUFjLFVBQWQsQ0FBeUIsQ0FBQyxHQUExQixDQUE4QixLQUFBLENBQU0sTUFBTixFQUFjLFFBQWQsQ0FBQSxHQUF3QixHQUF4QixHQUE0QixJQUExRCxFQUFnRSxLQUFoRSxFQUZHO0lBQUEsQ0FYTDtHQXhJRixDQUFBOztBQUFBLEVBd0pNO0FBQ1MsSUFBQSxnQ0FBRSxRQUFGLEVBQWEsTUFBYixHQUFBO0FBQ1gsTUFEWSxJQUFDLENBQUEsV0FBQSxRQUNiLENBQUE7QUFBQSxNQUR1QixJQUFDLENBQUEsU0FBQSxNQUN4QixDQUFBO0FBQUEsTUFBQSxHQUFBLENBQUssNkNBQUEsR0FBNkMsSUFBQyxDQUFBLFFBQVEsQ0FBQyxHQUF2RCxHQUEyRCxpQkFBM0QsR0FBNEUsSUFBQyxDQUFBLE1BQWxGLENBQUEsQ0FBQTtBQUNBLGFBQVcsSUFBQSxLQUFBLENBQU0sSUFBTixFQUFZLDZCQUFaLENBQVgsQ0FGVztJQUFBLENBQWI7O2tDQUFBOztNQXpKRixDQUFBOztBQUFBLEVBNkpNO2dDQUNKOztBQUFBLDZCQUFBLGNBQUEsR0FBZ0IsU0FBQyxHQUFELEVBQU0sS0FBTixHQUFBO2FBQ1YsSUFBQSxRQUFBLENBQVMsR0FBVCxFQUFjLEtBQWQsRUFBcUIsSUFBckIsRUFEVTtJQUFBLENBQWhCLENBQUE7OzBCQUFBOztNQTlKRixDQUFBOztBQUFBLEVBaUtBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLFFBQUEsRUFBVSxRQUFWO0FBQUEsSUFDQSxjQUFBLEVBQWdCLGNBRGhCO0dBbEtGLENBQUE7QUFBQSIsImZpbGUiOiJSZXNvdXJjZS5qcyIsInNvdXJjZVJvb3QiOiIvaG9tZS9rbGlwL3B1Ymxpc2gvZ2FwaS1yZGYvbGliIn0=