# node-jsonrpc-client [![npm version](https://badge.fury.io/js/node-jsonrpc-client.svg)](https://badge.fury.io/js/node-jsonrpc-client)

A really, really simple JSON-RPC 2.0 client.

## Installation

```shell
npm install --save node-jsonrpc-client
```

## Usage

### Simple usage

```javascript
const JsonRpc = require("node-jsonrpc-client");

// Our API server is at http://example.org/api
const client = new JsonRpc("http://example.org/api");
// Let's call the 'saySomething' method that takes two parameters, 'to' and 'message'
client.call("saySomething", { to: "Alice", message: "Hi, Bob!" }).then(
  function success(result) {
    // The 'saySomething' method has a field 'output'
    console.log("output", result.output);
  },
  function failure(err) {
    // oops, something went wrong!
    console.error("Oops! Error code " + err.code + ": " + err.message);
  }
);
```

### Using cookies

If the API is using a cookie to keep track of the session, you can use `setUseCookies(true)`:

```javascript
const JsonRpc = require("node-jsonrpc-client");

let SessionCookie = null; // store session cookie for later

// Our API server is at http://example.org/api
const client = new JsonRpc("http://example.org/api");
// Let's call the 'login' method that takes two parameters, 'username' and 'password'
client.call("login", { username: "alice", password: "monkey" }).then(
  function success(loginResult) {
    // The 'getMessages' method has a field 'messages' and requires the cookie from login
    client.call("getMessages", {}).then((msgResult) => {
      console.log("Messages: ", result.messages);
    });
    SessionCookie = client.getCookie(); // gets our session cookie for later use (see below)
  },
  function failure(err) {
    // oops, something went wrong!
    console.error("Oops! Error code " + err.code + ": " + err.message);
  }
);
```

You can also get hold of the cookie using `getCookie` and `setCookie` to set a cookie

```javascript
const JsonRpc = require("node-jsonrpc-client");

// Our API server is at http://example.org/api
const client = new JsonRpc("http://example.org/api");

client.setCookie(SessionCookie); // the cookie from the example above, holding our session information

// Let's call the 'getMessages' method again without a login but using the cookie
client.call("getMessages", {}).then(
  function success(result) {
    // The 'getMessages' method has a field 'messages' and requires the cookie from login
    console.log("Messages: ", result.messages);
  },
  function failure(err) {
    // oops, something went wrong!
    console.error("Oops! Error code " + err.code + ": " + err.message);
  }
);
```
