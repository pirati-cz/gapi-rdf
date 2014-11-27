    Reflect = require 'harmony-reflect'

    class RDFEnvironment
      createResource: (iri, graph) ->
        new Resource iri, graph, this

    class Resource

      @RDFInterfacesExtMap =
        'Resource': Resource
        'RDFEnvironment': RDFEnvironment

      @environment = null

      constructor: (@iri, @graph, @environment) ->
        if @environment? and not Resource.environment?
          Resource.environment = @environment
        else if not @environment? and Resource.environment?
          @environment = Resource.environment
        if not @environment?
          throw new Error "Please provide an RDFEnvironment instance when instantiating a Resource"

        @subject = @environment.createNamedNode @iri

        unless @graph?
          @graph = do @environment.createGraph

        return new Proxy this, ResourceProxyHandler

      add: (predicate, object) ->
        triple = @environment.createTriple @subject, @_resolve(predicate), @_resolve(object)
        @graph.add triple
        this

      getAll: (predicate) ->
        objects = []
        @graph.match(@subject, @_resolve predicate).forEach (t) =>
          objects.push @_shrink t.object
        objects

      get: (predicate) ->
        objects = @getAll predicate
        switch objects.length
          when 0 then undefined
          when 1 then objects[0]
          else objects

      length: (predicate) ->
        if predicate?
          return (@getAll predicate).length
        @graph.length

      remove: (predicate, object) ->
        o = if object? then @_resolve object else null
        @graph.removeMatches(@subject, @_resolve(predicate), o)
        this

      replace: (predicate, object) ->
        @remove predicate
        @add predicate, object

      toString: ->
        @graph.toString()

      _resolve: (input) ->
        if Resource.is_Resource input
          return input.subject
        input = @environment.resolve input if Resource.is_CURIE input
        if Resource.is_IRI input
          return @environment.createNamedNode input
        @environment.createLiteral input

      _shrink: (input) ->
        value = input.nominalValue
        if Resource.is_IRI value
          return @environment.shrink value
        value

      _resolveClassCall: (prefix, method) ->
        dbg "resolveClassCall '#{prefix}':'#{method}'()"
        types = @getAll 'rdf:type'
        for rdf_type in types
          [type_prefix] = rdf_type.split /:/
          if prefix == type_prefix
            if @environment.getClass?
              handling_class = @environment.getClass rdf_type
              if handling_class? and handling_class.prototype[method]?
                fn = handling_class.prototype[method]
                dbg "resolveClassCall \tbinding call"
                return fn.bind this
        dbg "resolveClassCall \tundefined"
        undefined

      @is_CURIE: (name) ->
        /:[^\/][^\/]/.test name

      @is_IRI: (name) ->
        /:\/\//.test name

      @is_Resource: (object) ->
        return false if typeof object == 'string'
        if object? and object.subject? and object.iri?
          return true
        false

      # debug messages related to this class
      @dbg: (msg) ->
        #console.log "Resource: #{msg}"
 
      dbg: (msg) ->
        Resource.dbg msg

    # debug messages related to this module. uncomment console.log in Resource.dbg
    dbg = (msg) ->
      Resource.dbg msg

    # Reflect shortcuts
    __get = (target, name, reciever) ->
      Reflect.get target, name, reciever

    __set = (target, name, value) ->
      Reflect.set target, name, value

    # Proxy handler for catching properties of Resource (resource.*)
    ResourceProxyHandler = 
      get: (target, name, reciever) ->
        # use inline javascript to avoid CoffeeScript's looping through keys which triggers proxy handling methods
        `if (name in target) {
          return __get(target, name);
        }`

        dbg "HARMONY - resource catchall getter getting '#{name}' from resource"
        environment = __get target, 'environment'
        ns = environment.resolve name+':'
        dbg "HARMONY - resource catchall getter namespace: #{ns}"

        # unknown prefix, just fallback to object's property (non existing properties resolving into undefined)
        return __get target, name unless ns?

        proxy = new ResourceNamespaceProxy target, name
        __set target, name, proxy
        proxy

    # Proxy handler for catching properties of ResourceNamespaceProxy (resource.namespace_proxy.*)
    ResourceNamespaceProxyHandler =
      get: (target, name, reciever) ->
        dbg "HARMONY - ResourceNamespaceProxyHandler catchall getter getting '#{name}' from resource's graph"

        prefix = __get(target, 'prefix')
        resource = __get(target, 'resource')
        classCall = resource._resolveClassCall prefix, name
        return classCall if classCall?

        resource.get prefix+':'+name

      set: (target, name, value, reciever) ->
        dbg "HARMONY - ResourceNamespaceProxyHandler catchall setter setting '#{name}' with '#{value}' into resource's graph"
        __get(target, 'resource').add __get(target, 'prefix')+':'+name, value

    # class instantiated for every touched namespace prefix of a Resource to handle catchall predicates of the namespace prefix
    class ResourceNamespaceProxy
      constructor: (@resource, @prefix) ->
        dbg "HARMONY - new ResourceNamespaceHandler for #{@resource.iri} and ns prefix #{@prefix}"
        return new Proxy this, ResourceNamespaceProxyHandler

    module.exports = Resource
