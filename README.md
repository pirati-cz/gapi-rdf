gapi-rdf
========

This is a release of an unstable alpha version of GAPI RDF library. It's not tested at all. **Only for experimental purposes!**

Since the library uses Harmony proxies to catchall getters and setters you need to execute Node.js with `--harmony` option:

```
    node --harmony script_using_gapi-rdf.js
```

When you see `Error: proxies not supported on this platform`, you've probably forgotten to add the runtime option.

For the usage see [Resource test](https://github.com/pirati-cz/gapi-rdf/blob/master/test/src/Resource.litcoffee)

