import type { Product, RegisteredUser } from "./types";

export const productsQueryKey = ["products"] as const;

const API_URL = (
  import.meta.env.VITE_API_URL as string | undefined
)?.replace(/\/+$/, "");

export function apiUrl(endpoint: string) {
  if (!API_URL) {
    throw new Error(
      "VITE_API_URL is missing. Add your backend URL to the frontend .env file."
    );
  }

  const apiPrefix = /\/api$/i.test(API_URL) ? "" : "/api";
  const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  return `${API_URL}${apiPrefix}${path}`;
}

export async function apiRequest<T = unknown>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem("token");
  const headers = new Headers(options.headers);

  if (
    options.body &&
    !(options.body instanceof FormData) &&
    !headers.has("Content-Type")
  ) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(apiUrl(endpoint), {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || `Request failed (${response.status})`);
  }

  return data as T;
}

export async function getProducts(): Promise<Product[]> {
  const data = await apiRequest<{ products?: Product[] } | Product[]>(
    "/products"
  );

  return Array.isArray(data) ? data : data.products ?? [];
}

export function saveProduct(
  product: Omit<Product, "id" | "_id">,
  id?: string
) {
  return apiRequest(
    id ? `/products/${encodeURIComponent(id)}` : "/products",
    {
      method: id ? "PUT" : "POST",
      body: JSON.stringify({
        ...product,
        price: Number(product.price),
        image: product.image?.trim() ?? "",
      }),
    }
  );
}

export function removeProduct(id: string) {
  return apiRequest(`/products/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}

export async function getUsers(): Promise<RegisteredUser[]> {
  const data = await apiRequest<{ users: RegisteredUser[] }>("/auth/users");
  return data.users;
}
