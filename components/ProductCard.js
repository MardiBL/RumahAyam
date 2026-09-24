"use client";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useUser } from "@/context/UserContext";
import { formatRupiah } from "@/lib/format";
import { useState } from "react";
import LoginRequiredModal from "@/components/LoginRequiredModal";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { user } = useUser();
  const [added, setAdded] = useState(false);
  const [loginModal, setLoginModal] = useState(false);

  function handleAdd() {
    if (!user) { setLoginModal(true); return; }
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  }

  return <>
    <article className="product-card">
      <Link href={`/produk/${product.id}`}><div className="product-image"><img src={product.image} alt={product.name}/></div></Link>
      <div className="product-body"><Link href={`/produk/${product.id}`}><h3>{product.name}</h3></Link><div className="product-meta">Segar • {product.unit} • Stok {product.stock}</div>
        <div className="product-bottom"><div className="price">{formatRupiah(product.price)}/{product.unit}</div><button className="btn btn-primary add-btn" onClick={handleAdd}><ShoppingCart size={14} style={{verticalAlign:"-2px"}}/> {added?"Ditambahkan":"Tambah"}</button></div>
      </div>
    </article>
    <LoginRequiredModal open={loginModal} onClose={()=>setLoginModal(false)}/>
  </>;
}
