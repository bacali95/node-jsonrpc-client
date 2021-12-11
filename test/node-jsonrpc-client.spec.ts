import RpcServer from 'http-jsonrpc-server';
import { JsonRpc } from '../src';

describe('Node JsonRPC Client', () => {
  let server: RpcServer;

  beforeAll(async () => {
    server = new RpcServer({
      methods: {
        sum: (arr: number[]) => arr.reduce((acc, curr) => acc + curr, 0),
      },
    } as any);

    await server.listen(9090, '127.0.0.1');
  });

  it('should receive a successful result from the server', async () => {
    const client = new JsonRpc('http://127.0.0.1:9090');

    await expect(client.call<number[], number>('sum', [1, 2, 3])).resolves.toMatchObject({
      id: expect.any(String),
      jsonrpc: '2.0',
      result: 6,
    });
  });

  it('should receive an error result when calling a non existing method', async () => {
    const client = new JsonRpc('http://127.0.0.1:9090');

    await expect(client.call<number[], number>('prod', [1, 2, 3])).resolves.toMatchObject({
      id: expect.any(String),
      jsonrpc: '2.0',
      error: { code: expect.any(Number) },
    });
  });

  it('should receive an error result when calling with wrong parameters', async () => {
    const client = new JsonRpc('http://127.0.0.1:9090');

    await expect(client.call<number, number>('sum', 1)).resolves.toMatchObject({
      id: expect.any(String),
      jsonrpc: '2.0',
      error: { code: expect.any(Number) },
    });
  });

  it('should throws an error when server is down', async () => {
    const client = new JsonRpc('http://127.0.0.1:9091');

    try {
      await client.call<number[], number>('sum', [1, 2, 3]);
    } catch (error) {
      expect(error).toMatchObject({
        code: expect.any(String),
        name: 'JsonRpcError',
        message: 'connect ECONNREFUSED 127.0.0.1:9091',
        stack: expect.any(String),
      });
    }
  });

  afterAll(() => server.close());
});
