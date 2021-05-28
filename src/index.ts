import { CookieJar } from 'request';
import * as Request from 'request-promise';
import * as UUID from 'uuid';

class JsonRpcError implements Error {
  name: string = 'JsonRpcError';
  message: string;
  stack: string | undefined;

  constructor(message: string, public code: number) {
    this.message = message || 'Server returned an error response';
    this.stack = new Error().stack;
  }
}

class JsonRpc {
  cookieJar: CookieJar = Request.jar();

  constructor(private url: string, private useCookies: boolean = false) {}

  setUrl(url: string): void {
    this.url = url;
  }

  setUseCookies(useCookies: boolean): void {
    this.useCookies = useCookies;
    if (!this.useCookies) {
      this.cookieJar.setCookie('', this.url);
    }
  }

  setCookie(cookieString: string): void {
    if (!this.useCookies) {
      console.warn('setCookie can only be called, if setUseCookies(true) has been called before!');
      return;
    }
    this.cookieJar.setCookie(cookieString, this.url);
  }

  getCookie(): string {
    if (!this.useCookies) {
      console.warn('getCookie can only be called, if setUseCookies(true) has been called before!');
      return '';
    }
    return this.cookieJar.getCookieString(this.url);
  }

  call(method: string, params: any, useCookies: boolean = false): Promise<any> {
    this.setUseCookies(useCookies);

    return new Promise((resolve, reject) => {
      Request({
        url: this.url,
        method: 'POST',
        json: true,
        headers: {
          'Content-Type': 'application/json',
        },
        jar: useCookies || this.useCookies ? this.cookieJar : undefined,
        body: {
          id: UUID.v4(),
          jsonrpc: '2.0',
          method: method,
          params: params,
        },
      })
        .then((response) => {
          resolve(response);
        })
        .catch((err) => {
          reject(new JsonRpcError(err.message, err.statusCode));
        });
    });
  }
}

export = JsonRpc;
