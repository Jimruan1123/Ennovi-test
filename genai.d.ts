declare module '@google/genai' {
  export class GoogleGenAI {
    constructor(config: { apiKey: string });
    models: {
      generateContent: (params: any) => Promise<any>;
    };
  }
}
