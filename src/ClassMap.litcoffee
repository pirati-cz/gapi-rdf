    class ClassMap

      constructor: () ->

      get: (rdf_type, context_string = 'default') ->
        @[rdf_type]?[context_string]

      set: (rdf_type, handling_class, context_string = 'default') ->
        @[rdf_type] ?= {}
        @[rdf_type][context_string] = handling_class

      remove: (rdf_type, context_string = 'default') ->
        return unless @[rdf_type]?
        @[rdf_type][context_string] = undefined

      setDefault: (handling_class, context_string = 'default') ->
        @['default'] ?= {}
        @['default'][context_string] = handling_class

      importClassMap: (class_map, override) ->
        for rdf_type, value of class_map
          for context_string, handler of value
            @[rdf_type] ?= {}
            if override
              @[rdf_type][context_string] = handler
            else
              @[rdf_type][context_string] ?= handler

    class Profile

      getClass: (rdf_type, context_string) ->
        @['classes']?.get rdf_type, context_string

      setClass: (rdf_type, handling_class, context_string) ->
        @['classes'] ?= new ClassMap()
        @['classes'].set rdf_type, handling_class, context_string

      setDefaultClass: (handling_class, context_string) ->
        @['classes'] ?= new ClassMap()
        @['classes'].setDefault handling_class, context_string

    class RDFEnvironment

      createClassMap: (classMap) ->
        (new ClassMap()).import classMap

    module.exports =
      ClassMap: ClassMap
      Profile: Profile
      RDFEnvironment: RDFEnvironment