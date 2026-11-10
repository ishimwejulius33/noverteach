export type User = {
  id: string;
  name: string;
  email: string;
  role: string;
};

export type RegisteredUser = Pick<User, "name" | "email" | "role"> & {
  _id: string;
};

export type Product = {
  id?: number | string;
  _id?: string;
  name: string;
  description: string;
  price: number | string;
  category: string;
  image?: string;
  imageUrl?: string;
};

export function productId(product: Product): string {
  return String(product.id ?? product._id ?? "");
}
