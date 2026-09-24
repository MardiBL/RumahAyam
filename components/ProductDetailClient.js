"use client";

import { useState } from "react";
import Link from "next/link";
import { Minus, Plus, Star, ShoppingCart } from "lucide-react";
import { products } from "@/data/products";
import { formatRupiah } from "@/lib/format";
import { useCart } from "@/context/CartContext";
import ProductCard from "@/components/ProductCard";

export default function ProductDetailClient({ product }) {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();

  function add() {
    addToCart(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1300);
  }

  return (
    <div className="page">
      <div className="container">
        <p style={{fontSize:12,color:"#888",marginBottom:24}}>
          <Link href="/">Beranda</Link> &nbsp;/&nbsp; <Link href="/produk">Produk</Link> &nbsp;/&nbsp; {product.name}
        </p>

        <div className="detail-grid">
          <div>
            <div className="gallery-main"><img src={product.image} alt={product.name}/></div>
            <div className="thumbs">
              <button className="thumb"><img src={product.image} alt="thumbnail"/></button>
            </div>
          </div>

          <div className="detail">
            <h1>{product.name}</h1>
            <div className="rating">
              <Star size={16} fill="currentColor" style={{verticalAlign:"-3px"}}/> {product.rating} (120 ulasan)
            </div>
            <div className="detail-price">{formatRupiah(product.price)}/{product.unit}</div>
            <p>{product.description}</p>
            <div className="stock">● Stok tersedia</div>

            <div className="quantity">
              <button onClick={()=>setQty(Math.max(1, qty-1))}><Minus size={15}/></button>
              <span>{qty}</span>
              <button onClick={()=>setQty(qty+1)}><Plus size={15}/></button>
              <span style={{border:0,width:"auto",paddingLeft:10,color:"#777",fontSize:13}}>kg</span>
            </div>

            <button className="btn btn-primary btn-block" onClick={add}>
              <ShoppingCart size={17} style={{verticalAlign:"-3px"}}/> {added ? "Berhasil Ditambahkan" : "Tambah ke Keranjang"}
            </button>
            <Link href="/keranjang" className="btn btn-light btn-block" style={{display:"block",textAlign:"center",marginTop:10}}>
              Beli Sekarang
            </Link>

            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginTop:28}}>
              <div style={{padding:12,background:"#fafafa",borderRadius:10,fontSize:11,textAlign:"center"}}>🛡️<br/><b>100% Segar</b></div>
              <div style={{padding:12,background:"#fafafa",borderRadius:10,fontSize:11,textAlign:"center"}}>✓<br/><b>Tanpa Pengawet</b></div>
              <div style={{padding:12,background:"#fafafa",borderRadius:10,fontSize:11,textAlign:"center"}}>♨<br/><b>Higienis</b></div>
            </div>
          </div>
        </div>

        <section className="section" style={{paddingBottom:20}}>
          <div className="panel">
            <div style={{display:"flex",gap:25,borderBottom:"1px solid #eee",paddingBottom:12}}>
              <b style={{color:"#dc2626"}}>Deskripsi</b>
              <span style={{color:"#888"}}>Informasi Tambahan</span>
              <span style={{color:"#888"}}>Ulasan (120)</span>
            </div>
            <p style={{color:"#666",lineHeight:1.8}}>
              {product.description} Dengan proses pemeliharaan yang higienis dan pakan berkualitas,
              kami menjaga kualitas produk dari peternakan hingga sampai ke pelanggan.
            </p>
          </div>
        </section>

        <div className="section-head">
          <div><h2>Produk Lainnya</h2><p>Pilihan lain yang mungkin Anda suka.</p></div>
        </div>
        <div className="product-grid">
          {products.filter(p=>p.id!==product.id).slice(0,4).map(p=><ProductCard key={p.id} product={p}/>)}
        </div>
      </div>
    </div>
  );
}
