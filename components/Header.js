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
 const menubar = [
  {
    link: "/",
    menu: "Beranda",
  },
  {
    link: "/produk",
    menu: "Produk",
  },
  {
    link: "/tentang",
    menu: "Tentang Kami",
  },
  {
    link: "/kontak",
    menu: "Kontak Kami",
  },
  {
    link: "/keranjang",
    menu: "Keranjang Saya",
  },
  {
    link: "/profil",
    loginLink: "/login",
    menu: "Profil Saya",
    loginMenu: "Masuk",
  },
  
];
  return (
    <header className="sticky z-50 top-0 backdrop-blur-3xl bg-mist-100 border-b-[0.5px] ">
      <div className="px-10 flex justify-between p-3.5 items-center">
        <Link href="/" className="logo">
          <span className="logo-mark">🐔</span>
          <span>
            Ayam<span style={{ color: "#dc2626" }}>Ku</span>
          </span>
        </Link>
        <nav className="nav-links">
          <Link href="/">Beranda</Link>
          <Link href="/produk">Produk</Link>
          <Link href="/tentang">Tentang Kami</Link>
          <Link href="/kontak">Kontak</Link>
        </nav>
        <div className="flex items-center gap-2.5">
          <Link
            href="/produk"
            className="size-11 hidden md:grid  place-items-center"
            aria-label="Cari"
          >
            <Search size={19} />
          </Link>

          <Link
            href="/keranjang"
            className="size-11 hidden md:grid  place-items-center  items-center justify-center relative "
            aria-label="Keranjang"
          >
            <ShoppingCart size={18} />
            {totalItems > 0 && <span className="badge">{totalItems}</span>}
          </Link>
          {user ? (
            <Link
              href="/profil"
              className="bg-rose-100 px-3 py-1 rounded-full text-lg font-bold hidden md:block   !text-red-500"
            >
              {user.alias || user.fullName}
            </Link>
          ) : (
            <Link
              href="/login"
              className="btn btn-primary"
              style={{ padding: "9px 15px", fontSize: 13 }}
            >
              Masuk
            </Link>
          )}
          <button
            className="icon-btn mobile-menu"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
     {open && (
  <div className="absolute z-50 w-full h-[100vh] bg-white p-4 md:hidden">
    <div className="container grid gap-4 pt-4">
      {menubar.map((item) => {
        const href =
          item.loginLink && !user
            ? item.loginLink
            : item.link;

        const label =
          item.loginMenu && !user
            ? item.loginMenu
            : item.menu;

        return (
          <Link
            key={item.link}
            href={href}
            onClick={close}
            className=" border-[1px] p-4 rounded-[10px]"
          >
            {label}
          </Link>
        );
      })}
    </div>
  </div>
)}
    </header>
  );
}
