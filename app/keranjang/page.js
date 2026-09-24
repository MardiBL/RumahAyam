"use client";

import Link from "next/link";
import { Trash2, Minus, Plus, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatRupiah } from "@/lib/format";

export default function CartPage() {
  const { items, updateQty, removeItem, subtotal, shipping, total } = useCart();

  if (!items.length) {
    return (
      <div className="page">
        <div className="container">
          <div className="empty">
            <ShoppingBag size={48} style={{margin:"0 auto 15px",color:"#dc2626"}}/>
            <h2>Keranjang masih kosong</h2>
            <p>Yuk pilih ayam segar favorit Anda.</p>
            <Link href="/produk" className="btn btn-primary">Belanja Sekarang</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container">
        <h1>Keranjang Belanja</h1>
        <p style={{color:"#888"}}>{items.length} produk</p>

        <div className="cart-layout" style={{marginTop:24}}>
          <div className="panel">
            {items.map(item=>(
              <div className="cart-item" key={item.id}>
                <div className="cart-item-img"><img src={item.image} alt={item.name}/></div>
                <div>
                  <div className="item-name">{item.name}</div>
                  <div className="item-sub">{formatRupiah(item.price)}/{item.unit}</div>
                  <div className="cart-actions" style={{marginTop:10}}>
                    <div className="qty-mini">
                      <button onClick={()=>updateQty(item.id,item.qty-1)}><Minus size={12}/></button>
                      <span>{item.qty}</span>
                      <button onClick={()=>updateQty(item.id,item.qty+1)}><Plus size={12}/></button>
                    </div>
                    <button className="icon-btn" style={{width:30,height:30}} onClick={()=>removeItem(item.id)}><Trash2 size={15} color="#dc2626"/></button>
                  </div>
                </div>
                <strong>{formatRupiah(item.price * item.qty)}</strong>
              </div>
            ))}
          </div>

          <aside className="panel">
            <h3>Ringkasan Belanja</h3>
            <div className="summary-row"><span>Subtotal</span><span>{formatRupiah(subtotal)}</span></div>
            <div className="summary-row"><span>Ongkos Kirim</span><span>{formatRupiah(shipping)}</span></div>
            <div className="summary-row summary-total"><span>Total</span><span>{formatRupiah(total)}</span></div>
            <Link href="/checkout" className="btn btn-primary btn-block" style={{display:"block",textAlign:"center",marginTop:18}}>Lanjut ke Checkout</Link>
            <Link href="/produk" className="btn btn-light btn-block" style={{display:"block",textAlign:"center",marginTop:10}}>Lanjut Belanja</Link>
          </aside>
        </div>
      </div>
    </div>
  );
}
