"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";

export default function LoginPage() {
  const router = useRouter();
  const { user, login } = useUser();
  const [form,setForm] = useState({fullName:"",alias:"",phone:""});
  const [error,setError] = useState("");
  if (user) return <div className="page"><div className="container empty"><h2>Anda sudah masuk sebagai {user.alias}</h2><button className="btn btn-primary" onClick={()=>router.push("/profil")}>Buka Profil</button></div></div>;
  function submit(e){e.preventDefault(); if(!form.fullName||!form.alias||!form.phone){setError("Semua data wajib diisi.");return;} if(!/^08|^\+62/.test(form.phone)){setError("Masukkan nomor WhatsApp yang aktif.");return;} login(form); router.push("/");}
  return <div className="page"><div className="container" style={{maxWidth:520}}><div className="panel"><div style={{textAlign:"center",marginBottom:25}}><div className="modal-icon" style={{margin:"0 auto 12px"}}>🐔</div><h1 style={{margin:"0 0 8px"}}>Masuk ke AyamKu</h1><p style={{color:"#777",margin:0}}>Gunakan data aktif untuk pesanan dan pengantaran.</p></div>
    <form onSubmit={submit}><div className="form-group"><label>Nama Lengkap</label><input className="input" placeholder="Mardi Migrasi Buulolo" value={form.fullName} onChange={e=>setForm({...form,fullName:e.target.value})}/></div><div className="form-group"><label>Nama Alias / Panggilan</label><input className="input" placeholder="Mardi" value={form.alias} onChange={e=>setForm({...form,alias:e.target.value})}/></div><div className="form-group"><label>Nomor WhatsApp Aktif</label><input className="input" placeholder="081234567890" inputMode="tel" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}/></div>{error&&<div className="error-box">{error}</div>}<button className="btn btn-primary btn-block" type="submit">Masuk</button></form>
  </div></div></div>;
}
