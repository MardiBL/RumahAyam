import Link from "next/link";
import { Truck, ShieldCheck, Tag, Headphones, ArrowRight } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import Footer from "@/components/Footer";
import { products } from "@/data/products";

export default function HomePage() {
  return (
    <>
      <section className="hero">
        <div className="container hero-copy">
          <span className="eyebrow">● Ayam Segar & Berkualitas</span>
          <h1>Daging Ayam Segar <span>Langsung dari Peternakan</span></h1>
          <p>Nikmati kemudahan berbelanja ayam segar dengan kualitas terbaik, harga terjangkau, dan pengiriman cepat ke rumah Anda.</p>
          <div className="hero-buttons">
            <Link href="/produk" className="btn btn-primary">Belanja Sekarang <ArrowRight size={16} style={{verticalAlign:"-3px"}}/></Link>
            <Link href="/produk" className="btn btn-light">Lihat Produk</Link>
          </div>
        </div>
        <div className="hero-image">
          <img src={products[0].image} alt="Ayam segar AyamKu" />
        </div>
      </section>

      <div className="container">
        <div className="features">
          <div className="feature"><div className="feature-icon"><Truck size={21}/></div><div><strong>Pengiriman Cepat</strong><small>Pesanan sampai dengan aman dan tepat waktu.</small></div></div>
          <div className="feature"><div className="feature-icon"><ShieldCheck size={21}/></div><div><strong>Kualitas Terjamin</strong><small>Ayam segar dan sehat setiap hari.</small></div></div>
          <div className="feature"><div className="feature-icon"><Tag size={21}/></div><div><strong>Harga Terbaik</strong><small>Harga bersaing dengan kualitas premium.</small></div></div>
          <div className="feature"><div className="feature-icon"><Headphones size={21}/></div><div><strong>Layanan 24/7</strong><small>Siap membantu kapan saja.</small></div></div>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div><h2>Produk Unggulan</h2><p>Pilihan terbaik untuk kebutuhan keluarga Anda.</p></div>
            <Link href="/produk" style={{color:"#dc2626", fontWeight:800, fontSize:13}}>Lihat Semua →</Link>
          </div>
          <div className="product-grid">
            {products.slice(0,4).map((product) => <ProductCard key={product.id} product={product}/>)}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
