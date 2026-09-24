"use client";

import Link from "next/link";
import { Search, ShoppingCart, Menu, X } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useUser } from "@/context/UserContext";

export default function Header() {
  const [open, setOpen] = useState(false);
  const { totalItems } = useCart();
  const { user } = useUser();
  const close = () => setOpen(false);

  return (
    <header className="header">
      <div className="container nav">
        <Link href="/" className="logo"><span className="logo-mark">🐔</span><span>Ayam<span style={{color:"#dc2626"}}>Ku</span></span></Link>
        <nav className="nav-links">
          <Link href="/">Beranda</Link><Link href="/produk">Produk</Link><Link href="/tentang">Tentang Kami</Link><Link href="/kontak">Kontak</Link>
        </nav>
        <div className="nav-actions">
          <Link href="/produk" className="icon-btn" aria-label="Cari"><Search size={19}/></Link>
          <Link href="/keranjang" className="icon-btn" aria-label="Keranjang"><ShoppingCart size={19}/>{totalItems>0 && <span className="badge">{totalItems}</span>}</Link>
          {user ? <Link href="/profil" className="user-pill">{user.alias || user.fullName}</Link> : <Link href="/login" className="btn btn-primary" style={{padding:"9px 15px",fontSize:13}}>Masuk</Link>}
          <button className="icon-btn mobile-menu" onClick={()=>setOpen(!open)} aria-label="Menu">{open?<X size={20}/>:<Menu size={20}/>}</button>
        </div>
      </div>
      {open && <div style={{borderTop:"1px solid #eee",padding:"10px 20px 18px",background:"#fff"}}><div className="container" style={{display:"grid",gap:8}}>
        <Link href="/" onClick={close}>Beranda</Link><Link href="/produk" onClick={close}>Produk</Link><Link href="/tentang" onClick={close}>Tentang Kami</Link><Link href="/kontak" onClick={close}>Kontak</Link>{user?<Link href="/profil" onClick={close}>Profil ({user.alias})</Link>:<Link href="/login" onClick={close}>Masuk</Link>}
      </div></div>}
    </header>
  );
}
