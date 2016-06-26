React Angular $Http $Resource
=========================


React restful and normal http request tools that was converted from angular's $http and $resource it can be used to create
restful services easier requests.

Interceptors can be used to intercept error requests and deal with them globally - in-cases of token authentication or something along this line.


##Installation

```javascript
npm react-angular-http-resource
```

###HTTP Usage and options:

```javascript
var HTTP = require('react-angular-http-resource').HTTP;

// set up interceptors or set up default options at the main entrance point
// this will be available throughout the app.
HTTP.setOptions({
  interceptors: {
    responseError: function(response) {
      // auth.removeUserCookie() // you can do something like.
      browserHistory.push('login');
      return response;
    }
  }
});
```

###Resource Usage:

```javascript
var resource = require('react-angular-http-resource').resource;

// create a resource using "resource" factory.
var Users = resource('http://domain.com/v1.0/users');

// using the resource to fetch data.
var res =  Users.get( function(data) {
  console.log('data', data);
});
```
