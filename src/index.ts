import axios from 'axios';
import axiosCookieJarSupport from 'axios-cookiejar-support';
import * as uuid from 'uuid';
import type { CookieJar } from 'tough-cookie';

axiosCookieJarSupport(axios);

export class JsonRpcError implements Error {
  name: string = 'JsonRpcError';
  message: string;
  stack?: string;

  constructor(message: string, public code: string) {
    this.message = message || 'Server returned an error response';
    this.stack = new Error().stack;
  }
}

export type JsonRpcResult<T> = {
  id: string;
  jsonrpc: '2.0';
  result?: T;
  error?: Error;
};

export class JsonRpc {
  constructor(private url: string) {}

  setUrl(url: string): void {
    this.url = url;
  }

  async call<P, R>(method: string, params: P, cookieJar?: CookieJar): Promise<JsonRpcResult<R>> {
    try {
      const response = await axios.post<JsonRpcResult<R>>(
        this.url,
        {
          id: uuid.v4(),
          jsonrpc: '2.0',
          method: method,
          params: params,
        },
        { jar: cookieJar },
      );

      return response.data;
    } catch (error) {
      throw new JsonRpcError(error.message, error.response?.statusText ?? error.code);
    }
  }
}
