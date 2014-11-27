
    getKeys = (object, type) ->
      return Object.keys object.prototype if type == 'prototype'
      Object.keys object

    processMap = (byWhatMap) ->
      if byWhatMap instanceof Array
        [byWhatProperty, type, keys] = byWhatMap
      else
        byWhatProperty = byWhatMap
      type ?= 'prototype'
      keys ?= getKeys byWhatProperty, type
      return [byWhatProperty, type, keys]

    extendByMap = (what, how) ->
      for whatProperty, byWhatMap of how
        [byWhatProperty, type, keys] = processMap byWhatMap
        if what[whatProperty]?
          for key in keys
            if type == 'prototype'
              what[whatProperty].prototype[key] = byWhatProperty.prototype[key]
            else
              what[whatProperty][key] = byWhatProperty[key]
        else
          what[whatProperty] = byWhatProperty

    interfaces = (implementation) ->
      rdf = require switch implementation
        when 'rdf', 'node-rdf'
          './interfaces_rdf'
        else
          './interfaces_rdf'
      ### // TODO
        when 'rdfi', 'rdf-interfaces'
          './interfaces_rdfi'
        when 'rdf_js_interface', 'rdf_js_interfaces', 'rdfstore', 'rdfstorejs', 'rdfstore.js'
          './interfaces_rdf_js_interface'
      ###
      rdf.interfaces = interfaces
      rdf.use = (extension) ->
        if extension.RDFInterfacesExtMap?
          extendByMap rdf, extension.RDFInterfacesExtMap
      rdf.extensions ?= {}
      rdf.extensions.ClassMap ?= require './ClassMap'
      rdf.extensions.Resource ?= require './Resource'
      rdf

    module.exports = interfaces()
