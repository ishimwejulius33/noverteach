import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getProducts, productsQueryKey } from "../api";
import { useAuth } from "../context/AuthContext";
import type { Product } from "../types";
import { useQuery } from "@tanstack/react-query";

export default function Products() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [cart, setCart] = useState<Product[]>([]);
  const { user } = useAuth();
  const productsQuery = useQuery({
    queryKey: productsQueryKey,
    queryFn: getProducts,
  });
  const products = productsQuery.data ?? [];

  const categories = ["All", ...Array.from(new Set(products.map(p => p.category)))];
  const filtered = products.filter(product =>
    `${product.name} ${product.description} ${product.category}`.toLowerCase().includes(search.toLowerCase()) &&
    (category === "All" || product.category === category)
  );

  function addToCart(product: Product) {
    if (!user) {
      navigate(`/login?next=${encodeURIComponent("/products")}`);
      return;
    }
    setCart(current => [...current, product]);
  }

  return (
    <section className="section products-page">
      <div className="page-heading">
        <div><p className="eyebrow">THE COLLECTION</p><h1>Products built for your world.</h1>
          <p className="muted">Explore our current phones and laptops.</p></div>
        <div className="cart-count">🛒 Cart <strong>{cart.length}</strong></div>
      </div>
      {user && <p className="notice">Signed in as {user.name}. Cart items are temporary and are not a completed order.</p>}
      <div className="product-toolbar">
        <input aria-label="Search products" placeholder="Search phones, laptops..." value={search} onChange={e => setSearch(e.target.value)} />
        <select aria-label="Filter by category" value={category} onChange={e => setCategory(e.target.value)}>
          {categories.map(item => <option key={item}>{item}</option>)}
        </select>
      </div>
      {productsQuery.isLoading && <p>Loading products from the store...</p>}
      {productsQuery.isError && <div className="error-message">{productsQuery.error.message}. Check the API URL, route prefix, and Render service status.</div>}
      {!productsQuery.isLoading && !productsQuery.isError && filtered.length === 0 && <p className="empty-state">No products found yet. Please check back later.</p>}
      <div className="product-grid">
        {filtered.map(product => (
          <article className="product-card" key={String(product.id ?? product._id ?? product.name)}>
            <div className="product-art"><span className="product-tag">{product.category}</span>
              {product.image || product.imageUrl
                ? <img src={product.image || product.imageUrl} alt={product.name} />
                : <div className={`product-placeholder ${product.category.toLowerCase().includes("laptop") ? "laptop-placeholder" : "phone-placeholder"}`} />}
            </div>
            <div className="product-info">
              <h3>{product.name}</h3><p className="product-description">{product.description}</p>
              <div className="product-bottom"><strong className="price">{Number(product.price).toLocaleString()} </strong><span className="price-currency">RWF / price units</span></div>
              <button className="btn btn-primary full-width" onClick={() => addToCart(product)}>Add to cart</button>
            </div>
          </article>
        ))}
      </div>
      {cart.length > 0 && <div className="cart-panel"><div><strong>{cart.length} item(s) in your cart</strong><p>Checkout and payment are not connected yet.</p></div><button className="btn btn-outline" onClick={() => setCart([])}>Clear cart</button></div>}
      <p className="small-note">Admin? <Link to="/admin">Manage store products</Link></p>
    </section>
  );
}
