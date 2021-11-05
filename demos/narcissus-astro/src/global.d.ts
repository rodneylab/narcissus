export declare global {
  interface Window {
    hcaptcha: {
      execute(
        hcaptchaWidgetID: string,
        opts?: { async: boolean },
      ): Promise<HCaptchaExecuteResponse>;
      render(id: string, config: { sitekey: string; size: string; theme: string }): string;
    };
  }
}
