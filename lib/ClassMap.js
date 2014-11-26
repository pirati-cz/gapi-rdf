(function() {
  var ClassMap, Profile, RDFEnvironment;

  ClassMap = (function() {
    function ClassMap() {}

    ClassMap.prototype.get = function(rdf_type, context_string) {
      var _ref;
      if (context_string == null) {
        context_string = 'default';
      }
      return (_ref = this[rdf_type]) != null ? _ref[context_string] : void 0;
    };

    ClassMap.prototype.set = function(rdf_type, handling_class, context_string) {
      if (context_string == null) {
        context_string = 'default';
      }
      if (this[rdf_type] == null) {
        this[rdf_type] = {};
      }
      return this[rdf_type][context_string] = handling_class;
    };

    ClassMap.prototype.remove = function(rdf_type, context_string) {
      if (context_string == null) {
        context_string = 'default';
      }
      if (this[rdf_type] == null) {
        return;
      }
      return this[rdf_type][context_string] = void 0;
    };

    ClassMap.prototype.setDefault = function(handling_class, context_string) {
      if (context_string == null) {
        context_string = 'default';
      }
      if (this['default'] == null) {
        this['default'] = {};
      }
      return this['default'][context_string] = handling_class;
    };

    ClassMap.prototype.importClassMap = function(class_map, override) {
      var context_string, handler, rdf_type, value, _results;
      _results = [];
      for (rdf_type in class_map) {
        value = class_map[rdf_type];
        _results.push((function() {
          var _base, _results1;
          _results1 = [];
          for (context_string in value) {
            handler = value[context_string];
            if (this[rdf_type] == null) {
              this[rdf_type] = {};
            }
            if (override) {
              _results1.push(this[rdf_type][context_string] = handler);
            } else {
              _results1.push((_base = this[rdf_type])[context_string] != null ? _base[context_string] : _base[context_string] = handler);
            }
          }
          return _results1;
        }).call(this));
      }
      return _results;
    };

    return ClassMap;

  })();

  Profile = (function() {
    function Profile() {}

    Profile.prototype.getClass = function(rdf_type, context_string) {
      var _ref;
      return (_ref = this['classes']) != null ? _ref.get(rdf_type, context_string) : void 0;
    };

    Profile.prototype.setClass = function(rdf_type, handling_class, context_string) {
      if (this['classes'] == null) {
        this['classes'] = new ClassMap();
      }
      return this['classes'].set(rdf_type, handling_class, context_string);
    };

    Profile.prototype.setDefaultClass = function(handling_class, context_string) {
      if (this['classes'] == null) {
        this['classes'] = new ClassMap();
      }
      return this['classes'].setDefault(handling_class, context_string);
    };

    return Profile;

  })();

  RDFEnvironment = (function() {
    function RDFEnvironment() {}

    RDFEnvironment.prototype.createClassMap = function(classMap) {
      return (new ClassMap())["import"](classMap);
    };

    return RDFEnvironment;

  })();

  module.exports = {
    ClassMap: ClassMap,
    Profile: Profile,
    RDFEnvironment: RDFEnvironment
  };

}).call(this);

//# sourceMappingURL=sourcemaps/ClassMap.js.map