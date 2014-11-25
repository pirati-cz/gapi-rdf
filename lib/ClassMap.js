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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNsYXNzTWFwLmxpdGNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBSTtBQUFBLE1BQUEsaUNBQUE7O0FBQUEsRUFBTTtBQUVTLElBQUEsa0JBQUEsR0FBQSxDQUFiOztBQUFBLHVCQUVBLEdBQUEsR0FBSyxTQUFDLFFBQUQsRUFBVyxjQUFYLEdBQUE7QUFDSCxVQUFBLElBQUE7O1FBRGMsaUJBQWlCO09BQy9CO21EQUFhLENBQUEsY0FBQSxXQURWO0lBQUEsQ0FGTCxDQUFBOztBQUFBLHVCQUtBLEdBQUEsR0FBSyxTQUFDLFFBQUQsRUFBVyxjQUFYLEVBQTJCLGNBQTNCLEdBQUE7O1FBQTJCLGlCQUFpQjtPQUMvQzs7UUFBQSxJQUFFLENBQUEsUUFBQSxJQUFhO09BQWY7YUFDQSxJQUFFLENBQUEsUUFBQSxDQUFVLENBQUEsY0FBQSxDQUFaLEdBQThCLGVBRjNCO0lBQUEsQ0FMTCxDQUFBOztBQUFBLHVCQVNBLE1BQUEsR0FBUSxTQUFDLFFBQUQsRUFBVyxjQUFYLEdBQUE7O1FBQVcsaUJBQWlCO09BQ2xDO0FBQUEsTUFBQSxJQUFjLHNCQUFkO0FBQUEsY0FBQSxDQUFBO09BQUE7YUFDQSxJQUFFLENBQUEsUUFBQSxDQUFVLENBQUEsY0FBQSxDQUFaLEdBQThCLE9BRnhCO0lBQUEsQ0FUUixDQUFBOztBQUFBLHVCQWFBLFVBQUEsR0FBWSxTQUFDLGNBQUQsRUFBaUIsY0FBakIsR0FBQTs7UUFBaUIsaUJBQWlCO09BQzVDOztRQUFBLElBQUUsQ0FBQSxTQUFBLElBQWM7T0FBaEI7YUFDQSxJQUFFLENBQUEsU0FBQSxDQUFXLENBQUEsY0FBQSxDQUFiLEdBQStCLGVBRnJCO0lBQUEsQ0FiWixDQUFBOztBQUFBLHVCQWlCQSxjQUFBLEdBQWdCLFNBQUMsU0FBRCxFQUFZLFFBQVosR0FBQTtBQUNkLFVBQUEsa0RBQUE7QUFBQTtXQUFBLHFCQUFBO29DQUFBO0FBQ0U7O0FBQUE7ZUFBQSx1QkFBQTs0Q0FBQTs7Y0FDRSxJQUFFLENBQUEsUUFBQSxJQUFhO2FBQWY7QUFDQSxZQUFBLElBQUcsUUFBSDs2QkFDRSxJQUFFLENBQUEsUUFBQSxDQUFVLENBQUEsY0FBQSxDQUFaLEdBQThCLFNBRGhDO2FBQUEsTUFBQTtxRkFHYyxDQUFBLGNBQUEsU0FBQSxDQUFBLGNBQUEsSUFBbUIsU0FIakM7YUFGRjtBQUFBOztzQkFBQSxDQURGO0FBQUE7c0JBRGM7SUFBQSxDQWpCaEIsQ0FBQTs7b0JBQUE7O01BRkYsQ0FBQTs7QUFBQSxFQTRCTTt5QkFFSjs7QUFBQSxzQkFBQSxRQUFBLEdBQVUsU0FBQyxRQUFELEVBQVcsY0FBWCxHQUFBO0FBQ1IsVUFBQSxJQUFBO29EQUFZLENBQUUsR0FBZCxDQUFrQixRQUFsQixFQUE0QixjQUE1QixXQURRO0lBQUEsQ0FBVixDQUFBOztBQUFBLHNCQUdBLFFBQUEsR0FBVSxTQUFDLFFBQUQsRUFBVyxjQUFYLEVBQTJCLGNBQTNCLEdBQUE7O1FBQ1IsSUFBRSxDQUFBLFNBQUEsSUFBa0IsSUFBQSxRQUFBLENBQUE7T0FBcEI7YUFDQSxJQUFFLENBQUEsU0FBQSxDQUFVLENBQUMsR0FBYixDQUFpQixRQUFqQixFQUEyQixjQUEzQixFQUEyQyxjQUEzQyxFQUZRO0lBQUEsQ0FIVixDQUFBOztBQUFBLHNCQU9BLGVBQUEsR0FBaUIsU0FBQyxjQUFELEVBQWlCLGNBQWpCLEdBQUE7O1FBQ2YsSUFBRSxDQUFBLFNBQUEsSUFBa0IsSUFBQSxRQUFBLENBQUE7T0FBcEI7YUFDQSxJQUFFLENBQUEsU0FBQSxDQUFVLENBQUMsVUFBYixDQUF3QixjQUF4QixFQUF3QyxjQUF4QyxFQUZlO0lBQUEsQ0FQakIsQ0FBQTs7bUJBQUE7O01BOUJGLENBQUE7O0FBQUEsRUF5Q007Z0NBRUo7O0FBQUEsNkJBQUEsY0FBQSxHQUFnQixTQUFDLFFBQUQsR0FBQTthQUNkLENBQUssSUFBQSxRQUFBLENBQUEsQ0FBTCxDQUFnQixDQUFDLFFBQUQsQ0FBaEIsQ0FBd0IsUUFBeEIsRUFEYztJQUFBLENBQWhCLENBQUE7OzBCQUFBOztNQTNDRixDQUFBOztBQUFBLEVBOENBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLFFBQUEsRUFBVSxRQUFWO0FBQUEsSUFDQSxPQUFBLEVBQVMsT0FEVDtBQUFBLElBRUEsY0FBQSxFQUFnQixjQUZoQjtHQS9DRixDQUFBO0FBQUEiLCJmaWxlIjoiQ2xhc3NNYXAuanMiLCJzb3VyY2VSb290IjoiL2hvbWUvbHVidW50dS9wdWJsaXNoL2dhcGktcmRmL3NyYyJ9