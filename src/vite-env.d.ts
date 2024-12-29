/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_ENDPOINT_USER: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}