"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import { useUser } from "@/context/UserContext";
import { formatRupiah } from "@/lib/format";

export default function CheckoutPage(){
  const router=useRouter(); const {items,subtotal,shipping,total}=useCart(); const {user,addresses,mainAddress,createOrder}=useUser();
  const [payment,setPayment]=useState("COD"); const [selected,setSelected]=useState(mainAddress?.id||"");
  useEffect(()=>{ if(!user) router.replace('/login'); },[user,router]);
  useEffect(()=>{ if(mainAddress&&!selected) setSelected(mainAddress.id); },[mainAddress,selected]);
  if(!user) return null;
  if(!items.length) return <div className="page"><div className="container empty"><h2>Belum ada produk untuk checkout.</h2><Link className="btn btn-primary" href="/produk">Pilih Produk</Link></div></div>;
  if(!addresses.length) return <div className="page"><div className="container"><div className="empty"><h2>Tambahkan alamat terlebih dahulu</h2><p>Alamat pengiriman dan nomor yang dapat dihubungi wajib tersedia sebelum checkout.</p><Link className="btn btn-primary" href="/profil">Tambah / Kelola Alamat</Link></div></div></div>;
  const address=addresses.find(a=>a.id===selected)||mainAddress;
  function submit(){const order=createOrder({items,subtotal,shipping,total,paymentMethod:payment,address}); if(payment==='QRIS') router.push(`/pembayaran/qris?order=${order.id}`); else router.push(`/akun/pesanan/${order.id}`);}
  return <div className="page"><div className="container"><h1>Checkout</h1><div className="steps" style={{marginTop:20}}><div className="step active"><span className="step-number">1</span> Alamat</div><div className="step active"><span className="step-number">2</span> Pembayaran</div><div className="step"><span className="step-number">3</span> Konfirmasi</div></div>
    <div className="cart-layout"><div className="panel"><div className="section-head"><div><h3>Alamat Pengiriman</h3><p>Pilih alamat utama atau alamat lain.</p></div><Link href="/profil" className="btn btn-light" style={{fontSize:12}}>Kelola Alamat</Link></div>{addresses.map(a=><label className={`radio-card ${selected===a.id?'active':''}`} key={a.id}><input type="radio" name="address" checked={selected===a.id} onChange={()=>setSelected(a.id)}/><div><b>{a.label} {a.isMain&&<span className="main-badge">Utama</span>}</b><br/><small>{a.recipient} • {a.phone}</small><br/><small>{a.address}{a.city?`, ${a.city}`:""}</small></div></label>)}
      <h3 style={{marginTop:28}}>Metode Pembayaran</h3><label className={`radio-card ${payment==='COD'?'active':''}`}><input type="radio" name="payment" checked={payment==='COD'} onChange={()=>setPayment('COD')}/><div><b>Bayar di Tempat (COD)</b><br/><small>Bayar saat pesanan diterima.</small></div></label><label className={`radio-card ${payment==='QRIS'?'active':''}`}><input type="radio" name="payment" checked={payment==='QRIS'} onChange={()=>setPayment('QRIS')}/><div><b>QRIS</b><br/><small>Scan QRIS lalu upload foto bukti pembayaran (wajib).</small></div></label>
    </div><aside className="panel"><h3>Ringkasan Pesanan</h3>{items.map(item=><div key={item.id} style={{display:'flex',justifyContent:'space-between',padding:'9px 0',fontSize:13,borderBottom:'1px solid #eee'}}><span>{item.name} × {item.qty}</span><b>{formatRupiah(item.price*item.qty)}</b></div>)}<div className="summary-row"><span>Subtotal</span><span>{formatRupiah(subtotal)}</span></div><div className="summary-row"><span>Ongkir</span><span>{formatRupiah(shipping)}</span></div><div className="summary-row summary-total"><span>Total</span><span>{formatRupiah(total)}</span></div><button className="btn btn-primary btn-block" style={{marginTop:15}} onClick={submit}>{payment==='QRIS'?'Lanjut ke Pembayaran QRIS':'Checkout & Buat Pesanan'}</button></aside></div>
  </div></div>;
}
