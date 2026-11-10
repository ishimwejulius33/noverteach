import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getProducts, productsQueryKey } from "../api";

export default function Home() {
  const productsQuery = useQuery({
    queryKey: productsQueryKey,
    queryFn: getProducts,
  });
  const products = productsQuery.data ?? [];

  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">TECH THAT MOVES YOU</p>
          <h1>Upgrade your world with <span>better tech.</span></h1>
          <p className="hero-description">
            Discover phones and laptops chosen for your work, creativity, and everyday life.
          </p>
          <div className="hero-actions">
            <Link className="btn btn-primary" to="/products">Shop products ↗</Link>
            <Link className="btn btn-outline" to="/about">About our store</Link>
          </div>
          <div className="hero-note"><span className="status-dot" /> Simple shopping. Trusted technology.</div>
        </div>
        <div className="hero-media">
          <img
            src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1500&q=85"
            alt="Laptop and workspace ready for your next project"
          />
          <div className="hero-image-caption"><span>THE EVERYDAY UPGRADE</span><strong>Work. Create. Explore.</strong></div>
        </div>
      </section>
      <section className="section">
        <div className="section-heading">
          <div><p className="eyebrow">EXPLORE OUR STORE</p><h2>Find your next favorite</h2></div>
          <Link className="text-link" to="/products">View all products →</Link>
        </div>
        <div className="category-grid">
          <Link className="category-card phone-category" to="/products">
            <img src="https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=900&q=80" alt="Smartphone" loading="lazy" />
            <div><p>SMARTPHONES</p><h3>Stay connected.</h3><span>Explore phones →</span></div>
          </Link>
          <Link className="category-card laptop-category" to="/products">
            <img src="https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=80" alt="Laptop on a desk" loading="lazy" />
            <div><p>LAPTOPS</p><h3>Make more possible.</h3><span>Explore laptops →</span></div>
          </Link>
        </div>
      </section>
      <section className="section home-products">
        <div className="section-heading">
          <div><p className="eyebrow">RECENTLY ADDED</p><h2>Shop our products</h2></div>
          <Link className="text-link" to="/products">View all products →</Link>
        </div>
        {productsQuery.isLoading && <p>Loading products from the store...</p>}
        {productsQuery.isError && <div className="error-message">{productsQuery.error.message}. Check the API URL, route prefix, and Render service status.</div>}
        {!productsQuery.isLoading && !productsQuery.isError && products.length === 0 && <p className="empty-state">No products found yet. Please check back later.</p>}
        {!productsQuery.isLoading && !productsQuery.isError && products.length > 0 && (
          <div className="product-grid">
            {products.map(product => (
              <article className="product-card" key={String(product.id ?? product._id ?? product.name)}>
                <div className="product-art">
                  <span className="product-tag">{product.category}</span>
                  {product.image || product.imageUrl
                    ? <img src={product.image || product.imageUrl} alt={product.name} />
                    : <div className={`product-placeholder ${product.category.toLowerCase().includes("laptop") ? "laptop-placeholder" : "phone-placeholder"}`} />}
                </div>
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <p className="product-description">{product.description}</p>
                  <div className="product-bottom"><strong className="price">{Number(product.price).toLocaleString()}</strong><span className="price-currency">RWF / price units</span></div>
                  <Link className="btn btn-primary full-width" to="/products">View product</Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
      <section className="trust-strip"><span>✓ Carefully selected tech</span><span>✓ Helpful support</span><span>✓ Secure account access</span></section>
    </>
  );
}
