/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_BACKEND_API: string;
    readonly VITE_API_ENDPOINT_USER: string;
    readonly VITE_API_ENDPOINT_CATEGORY: string;
    readonly VITE_API_ENDPOINT_PRODUCT: string;
    readonly VITE_API_ENDPOINT_FAQ: string;
    readonly VITE_API_ENDPOINT_VOUCHER: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}