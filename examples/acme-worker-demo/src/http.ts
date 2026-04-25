// @ts-nocheck
// HTTP wrapper. Currently axios; @acme/http is the team standard.
// TODO: migrate callers off this once @acme/http ships v2.

import axios from "axios";

export const http = axios;
export default axios;
