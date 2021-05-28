const JsonRpc = require('../lib/index');
const Server = require('http-jsonrpc-server');

function sum(arr) {
  let total = 0;
  for (let n = 0; n < arr.length; n += 1) {
    total += arr[n];
  }
  return total;
}

const server = new Server({
  methods: {
    sum,
  },
});
const client = new JsonRpc('http://127.0.0.1:9090');

server.setMethod('sum', sum);
server.listen(9090, '127.0.0.1').then(() => {
  console.log('server is listening at http://127.0.0.1:9090');
  client
    .call('sum', [5, 6, 7])
    .then(console.log)
    .catch(console.log)
    .finally(() => server.close());
});
