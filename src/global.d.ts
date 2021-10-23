/// <reference types="@sveltejs/kit" />
import type { ILazyLoadInstance } from 'vanilla-lazyload';

interface ExecuteResponse {
  response: string;
  key: string;
}

export declare global {
  interface Document {
    lazyloadInstance: ILazyLoadInstance;
  }
}

export declare global {
  interface Window {
    hcaptcha: {
      execute(opts?: { async: boolean }): Promise<ExecuteResponse> | void;
      render(): void;
    };
  }
}
