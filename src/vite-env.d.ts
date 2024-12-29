/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly API_ENDPOINT_USER: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}