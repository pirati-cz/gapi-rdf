(function() {
  var extendByMap, getKeys, interfaces, processMap;

  getKeys = function(object, type) {
    if (type === 'prototype') {
      return Object.keys(object.prototype);
    }
    return Object.keys(object);
  };

  processMap = function(byWhatMap) {
    var byWhatProperty, keys, type;
    if (byWhatMap instanceof Array) {
      byWhatProperty = byWhatMap[0], type = byWhatMap[1], keys = byWhatMap[2];
    } else {
      byWhatProperty = byWhatMap;
    }
    if (type == null) {
      type = 'prototype';
    }
    if (keys == null) {
      keys = getKeys(byWhatProperty, type);
    }
    return [byWhatProperty, type, keys];
  };

  extendByMap = function(what, how) {
    var byWhatMap, byWhatProperty, key, keys, type, whatProperty, _ref, _results;
    _results = [];
    for (whatProperty in how) {
      byWhatMap = how[whatProperty];
      _ref = processMap(byWhatMap), byWhatProperty = _ref[0], type = _ref[1], keys = _ref[2];
      if (what[whatProperty] != null) {
        _results.push((function() {
          var _i, _len, _results1;
          _results1 = [];
          for (_i = 0, _len = keys.length; _i < _len; _i++) {
            key = keys[_i];
            if (type === 'prototype') {
              _results1.push(what[whatProperty].prototype[key] = byWhatProperty.prototype[key]);
            } else {
              _results1.push(what[whatProperty][key] = byWhatProperty[key]);
            }
          }
          return _results1;
        })());
      } else {
        _results.push(what[whatProperty] = byWhatProperty);
      }
    }
    return _results;
  };

  interfaces = function(implementation) {
    var rdf, _base, _base1;
    rdf = require((function() {
      switch (implementation) {
        case 'rdf':
        case 'node-rdf':
          return './interfaces_rdf';
        default:
          return './interfaces_rdf';
      }
    })());

    /* // TODO
      when 'rdfi', 'rdf-interfaces'
        './interfaces_rdfi'
      when 'rdf_js_interface', 'rdf_js_interfaces', 'rdfstore', 'rdfstorejs', 'rdfstore.js'
        './interfaces_rdf_js_interface'
     */
    rdf.interfaces = interfaces;
    rdf.use = function(extension) {
      if (extension.RDFInterfacesExtMap != null) {
        return extendByMap(rdf, extension.RDFInterfacesExtMap);
      }
    };
    if (rdf.extensions == null) {
      rdf.extensions = {};
    }
    if ((_base = rdf.extensions).ClassMap == null) {
      _base.ClassMap = require('./ClassMap');
    }
    if ((_base1 = rdf.extensions).Resource == null) {
      _base1.Resource = require('./Resource');
    }
    return rdf;
  };

  module.exports = interfaces();

}).call(this);

//# sourceMappingURL=sourcemaps/interfaces.js.map