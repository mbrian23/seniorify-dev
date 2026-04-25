// @ts-nocheck
// TODO #88 — frontend hammers /products on every page load. Add caching.

import axios from "axios";

const CATALOG_URL = process.env.CATALOG_URL ?? "https://catalog.internal/products";

interface Product {
  id: string;
  sku: string;
  name: string;
  priceCents: number;
}

export async function listProducts(req: { query: { tenant?: string } }): Promise<Product[]> {
  const tenant = req.query.tenant ?? "default";

  // Hits the catalog DB on every request. No memoization, no Redis, nothing.
  const res = await axios.get(CATALOG_URL, {
    params: { tenant },
  });

  return res.data.products as Product[];
}

export async function getProduct(id: string): Promise<Product | null> {
  const res = await axios.get(`${CATALOG_URL}/${id}`);
  return (res.data?.product as Product) ?? null;
}
