
# Cachet

Cachet redirects requests without a version parameter to the same location with a version parameter. 

For example, The request `http://www.example.com/sample.js` will get redirected to `http://www.example.com/sample.js?v=1.0.0`.

## Installation
This is a Node.js module available through the npm registry. Installation is done using the npm install command:

```
npm install @kiserit/cachet
```

## Get started

Here's a sample Express app that uses Cachet globally:

```javascript
const express = require("express");
const cachet = require('@kiserit/cachet');

const app = express();

// Use Cachet globally
app.use(cachet());

app.get("/sample.js", (req, res) => {
  // code inside the handler will be version specific
  // you can set cache-control
  res.header('Cache-Control', 'max-age=99999999');
  res.sendFile('./public/sample.js');
});

app.listen(3000);
```

Here's a sample Express app that uses Cachet on a specific route:

```javascript
const express = require("express");
const cachet = require('@kiserit/cachet');

const app = express();

// Use Cachet on specific route
app.get("/sample.js", cachet(), (req, res) => {
  // code inside the handler will be version specific
  // you can set cache-control
  res.header('Cache-Control', 'max-age=99999999');
  res.sendFile('./public/sample.js');
});

app.listen(3000);
```

You can also `import cachet from '@kiserit/cachet'` if you prefer.


## Default Options

```js
// These are the default options for Cachet
app.use(
  cachet({
    param: 'v',         // the query parameter name
    cache: 'no-store',  // cache-control header
    ext: ['js','css'],  // file extensions
    version: null       // use package version
  }),
);
```

## Custom Options

`param`

This is the query string parameter to use for versioning. This can be any valid query string parameter such as `ver`, `version`, `app_ver`, etc.

The default value is `v`.   
  

`cache`

This is the [Cache-Control](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control#no-store) header to use for the [HTTP 302](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/302) temporary redirects. 

The default value is `no-store` which indicates that any caches of any kind (private or shared) should not store this response.

`ext`

This is the list of file extensions that should be included in the versioning redirects. This should be an array of values. It can also be set to `true` to include all file extensions.

The default value is `['js','css']`. 

`version`

This is the version number to use when redirecting. This can be any valid query string parameter such as `1`, `1.1`, `1.0.1`, etc. 

The default value is `null` which indicates that `Cachet` should use the package version for your application.

