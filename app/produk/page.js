"use client";

import { useMemo, useState } from "react";
import ProductCard from "@/components/ProductCard";
import { categories, products } from "@/data/products";
import Footer from "@/components/Footer";

export default function ProductsPage() {
  const [category, setCategory] = useState("Semua");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => products.filter((p) => {
    const categoryMatch = category === "Semua" || p.category === category;
    const searchMatch = p.name.toLowerCase().includes(search.toLowerCase());
    return categoryMatch && searchMatch;
  }), [category, search]);

  return (
    <>
      <div className="page">
        <div className="container">
          <div className="section-head">
            <div><h2>Semua Produk</h2><p>Temukan berbagai pilihan ayam segar dengan kualitas terbaik.</p></div>
          </div>

          <div className=" gap-2.5 flex flex-wrap mb-6 md:hidden">
            {categories.map((item) => (
              <button key={item} className={`chip ${category === item ? "active" : ""}`} onClick={() => setCategory(item)}>
                {item}
              </button>
            ))}
          </div>

          <div className="shop-layout">
            <aside className="sidebar">
              <h4>Filter Produk</h4>
              <p style={{fontSize:12,color:"#999"}}>Kategori</p>
              {categories.map((item) => (
                <label key={item}>
                  <input type="radio" checked={category === item} onChange={() => setCategory(item)} />
                  {item}
                </label>
              ))}
         
            </aside>

            <div>
              <div className="search-row">
                <input className="input" value={search} onChange={(e)=>setSearch(e.target.value)} placeholder="Cari produk ayam..." />
                <select className="select" style={{maxWidth:180}}>
                  <option>Terbaru</option><option>Harga Terendah</option><option>Harga Tertinggi</option>
                </select>
              </div>
              <div className="product-grid">
                {filtered.map((product) => <ProductCard key={product.id} product={product}/>)}
              </div>
              {!filtered.length && <div className="empty">Produk tidak ditemukan.</div>}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
