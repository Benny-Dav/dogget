// Single entry point for the API. Components import { api } from "@/lib/api".
//
// Implementation is selected at module-load time. Default = mock.
// Set VITE_USE_MOCK_API=false in .env when the backend is wired up.

import { mockApi } from "./mock.js";
import { realApi } from "./real.js";

const useMock = import.meta.env.VITE_USE_MOCK_API !== "false";

export const api = useMock ? mockApi : realApi;
export { formatMoney, money } from "./format.js";
