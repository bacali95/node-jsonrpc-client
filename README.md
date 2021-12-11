# node-jsonrpc-client [![npm version](https://badge.fury.io/js/node-jsonrpc-client.svg)](https://badge.fury.io/js/node-jsonrpc-client)

A really, really simple JSON-RPC 2.0 client.

## Installation

```shell
npm install --save node-jsonrpc-client
# Or
yarn add node-jsonrpc-client
```

## Usage

### Simple usage

```javascript
const { JsonRpc } = require("node-jsonrpc-client");

// Our API server is at http://example.org/api
const client = new JsonRpc("http://example.org/api");
// Let's call the 'saySomething' method that takes two parameters, 'to' and 'message'
client.call("saySomething", { to: "Alice", message: "Hi, Bob!" })
  .then((result) => {
    // The 'saySomething' method has a field 'output'
    console.log("output", result.output);
  })
  .catch((err) => {
    // oops, something went wrong!
    console.error("Oops! Error code " + err.code + ": " + err.message);
  });
```

### Using cookies

If the API is using a cookie to keep track of the session, you can use `setUseCookies(true)`:

```javascript
const { JsonRpc } = require("node-jsonrpc-client");
const CookieJar = require('tough-cookie')

const cookieJar = new CookieJar()

// Our API server is at http://example.org/api
const client = new JsonRpc("http://example.org/api");
// Let's call the 'login' method that takes two parameters, 'username' and 'password'
client.call("login", { username: "alice", password: "monkey" }, cookieJar)
  .then((loginResult) => {
    // The 'getMessages' method has a field 'messages' and requires the cookie from login
    client.call("getMessages", {}, cookieJar).then((msgResult) => {
      console.log("Messages: ", result.messages);
    });
  })
  .catch((err) => {
    // oops, something went wrong!
    console.error("Oops! Error code " + err.code + ": " + err.message);
  });
```
