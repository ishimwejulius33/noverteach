
import { useState, type FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getProducts,
  getUsers,
  productsQueryKey,
  removeProduct,
  saveProduct,
} from "../api";
import { productId, type Product } from "../types";

const blank = {
  name: "",
  description: "",
  price: "",
  category: "Phone",
  image: "",
};

export default function Admin() {
  const [error, setError] = useState("");
  const [form, setForm] = useState(blank);
  const [editingId, setEditingId] = useState<string | undefined>();
  const [message, setMessage] = useState("");
  const queryClient = useQueryClient();
  const productsQuery = useQuery({
    queryKey: productsQueryKey,
    queryFn: getProducts,
  });
  const usersQuery = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });
  const products = productsQuery.data ?? [];
  const users = usersQuery.data ?? [];
  const saveMutation = useMutation({
    mutationFn: ({
      product,
      id,
    }: {
      product: Omit<Product, "id" | "_id">;
      id?: string;
    }) => saveProduct(product, id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: productsQueryKey }),
  });
  const removeMutation = useMutation({
    mutationFn: removeProduct,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: productsQueryKey }),
  });

  function change(field: keyof typeof blank, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      await saveMutation.mutateAsync({
        product: {
          name: form.name,
          description: form.description,
          price: Number(form.price),
          category: form.category,
          image: form.image,
        },
        id: editingId,
      });

      setForm(blank);
      setEditingId(undefined);
      setMessage(
        editingId
          ? "Product updated successfully."
          : "Product added successfully."
      );

    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not save product"
      );
    }
  }

  function edit(product: Product) {
    setEditingId(productId(product));
    setForm({
      name: product.name,
      description: product.description,
      price: String(product.price),
      category: product.category,
      image: product.image || product.imageUrl || "",
    });
    setMessage("");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function deleteProduct(product: Product) {
    const id = productId(product);

    if (!id || !window.confirm(`Delete "${product.name}"?`)) {
      return;
    }

    setError("");
    setMessage("");

    try {
      await removeMutation.mutateAsync(id);
      setMessage("Product deleted successfully.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not delete product"
      );
    }
  }

  function cancelEdit() {
    setEditingId(undefined);
    setForm(blank);
    setMessage("");
    setError("");
  }

  return (
    <section className="section admin-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">STORE CONTROL</p>
          <h1>Admin dashboard</h1>
          <p className="muted">
            Add products and keep your catalog up to date.
          </p>
        </div>

        <div className="admin-stat">
          <strong>{products.length}</strong>
          <span>Products</span>
        </div>
      </div>

      <p className="admin-social-link">
        Instagram: <a href="https://www.instagram.com/" target="_blank" rel="noreferrer">Open Instagram</a>
      </p>

      <div className="admin-layout">
        <form className="admin-form" onSubmit={submit}>
          <p className="eyebrow">
            {editingId ? "UPDATE CATALOG" : "NEW ITEM"}
          </p>

          <h2>{editingId ? "Edit product" : "Add a product"}</h2>

          {error && <div className="error-message">{error}</div>}
          {message && <div className="success-message">{message}</div>}

          <label>
            Product name
            <input
              required
              value={form.name}
              onChange={(e) => change("name", e.target.value)}
              placeholder="Product name"
            />
          </label>

          <label>
            Description
            <textarea
              required
              rows={3}
              value={form.description}
              onChange={(e) => change("description", e.target.value)}
              placeholder="Describe the product"
            />
          </label>

          <div className="form-row">
            <label>
              Price
              <input
                required
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={(e) => change("price", e.target.value)}
                placeholder="850"
              />
            </label>

            <label>
              Category
              <select
                value={form.category}
                onChange={(e) => change("category", e.target.value)}
              >
                <option>Phone</option>
                <option>Laptop</option>
                <option>Accessory</option>
                <option>Tablet</option>
              </select>
            </label>
          </div>

          <label htmlFor="product-image">Product image URL</label>
          <input
            id="product-image"
            type="url"
            value={form.image}
            onChange={(e) => change("image", e.target.value)}
            placeholder="https://example.com/product-image.jpg"
          />

          <button className="btn btn-primary full-width" disabled={saveMutation.isPending}>
            {saveMutation.isPending
              ? "Saving..."
              : editingId
                ? "Save changes"
                : "Add product"}
          </button>

          {editingId && (
            <button
              type="button"
              className="btn btn-outline full-width"
              onClick={cancelEdit}
            >
              Cancel editing
            </button>
          )}

          <p className="small-note">
            Add the product details and paste an image URL to display a photo.
          </p>
        </form>

        <div className="admin-products">
          <div className="list-heading">
            <h2>Product catalog</h2>
            <button
              type="button"
              className="btn btn-outline btn-small"
              onClick={() => void productsQuery.refetch()}
            >
              Refresh
            </button>
          </div>

          {productsQuery.isLoading && <p>Loading products...</p>}
          {productsQuery.isError && <div className="error-message">{productsQuery.error.message}</div>}

          {!productsQuery.isLoading && !productsQuery.isError && products.length === 0 && (
            <p className="empty-state">
              No products yet. Add your first product.
            </p>
          )}

          {products.map((product) => (
            <article
              className="admin-product-row"
              key={productId(product) || product.name}
            >
              { (product.image || product.imageUrl) ? (
                <img
                  className="product-image"
                  src={product.image || product.imageUrl}
                  alt={product.name}
                />
              ) : (
                <div className="admin-product-icon">
                  {product.category.toLowerCase().includes("laptop")
                    ? "▱"
                    : "▯"}
                </div>
              )}

              <div className="admin-product-main">
                <strong>{product.name}</strong>
                <span>
                  {product.category} ·{" "}
                  {Number(product.price).toLocaleString()}
                </span>
                <small>{product.description}</small>
              </div>

              <div className="product-actions">
                <button
                  type="button"
                  className="btn btn-edit btn-small"
                  onClick={() => edit(product)}
                >
                  Edit
                </button>

                <button
                  type="button"
                  className="btn btn-delete btn-small"
                  onClick={() => void deleteProduct(product)}
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="admin-users">
        <div className="list-heading">
          <h2>Registered users</h2>
          <button
            type="button"
            className="btn btn-outline btn-small"
            onClick={() => void usersQuery.refetch()}
          >
            Refresh
          </button>
        </div>
        {usersQuery.isLoading && <p>Loading users...</p>}
        {usersQuery.isError && (
          <div className="error-message">{usersQuery.error.message}</div>
        )}
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {!usersQuery.isLoading &&
              !usersQuery.isError &&
              users.length === 0 && (
                <tr>
                  <td colSpan={3}>No registered users yet.</td>
                </tr>
              )}
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
  