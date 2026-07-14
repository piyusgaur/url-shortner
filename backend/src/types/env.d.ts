declare namespace NodeJS {
  interface ProcessEnv {
    PORT?: string;
    MONGODB_URI?: string;
    CORS_ORIGIN?: string;
  }
}
