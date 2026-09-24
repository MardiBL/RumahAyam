"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { useAdmin, ADMIN_ACCOUNT } from "@/context/AdminContext";

export default function AdminLoginPage() {
  const router = useRouter();
  const { admin, login } = useAdmin();
  const [email, setEmail] = useState(ADMIN_ACCOUNT.email);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => { if (admin) router.replace("/admin/dashboard"); }, [admin, router]);

  function submit(e) {
    e.preventDefault();
    const result = login(email, password);
    if (!result.ok) return setError(result.message);
    router.push("/admin/dashboard");
  }

  return <div className="page"><div className="container" style={{maxWidth:520}}>
    <div className="panel admin-login-card">
      <div className="admin-login-icon"><ShieldCheck size={30}/></div>
      <h1>Login Admin</h1>
      <p style={{color:"#777",lineHeight:1.6}}>Login diperlukan untuk mengelola pesanan dan membalas pesan pelanggan.</p>
      <form onSubmit={submit}>
        <div className="form-group"><label>Email Admin</label><input className="input" type="email" value={email} onChange={e=>setEmail(e.target.value)} required/></div>
        <div className="form-group"><label>Password</label><input className="input" type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Masukkan password" required/></div>
        {error && <div className="notice danger" style={{marginBottom:15}}>{error}</div>}
        <button className="btn btn-primary btn-block">Masuk ke Dashboard</button>
      </form>
      <div className="admin-demo"><b>Demo:</b><br/>Email: {ADMIN_ACCOUNT.email}<br/>Password: {ADMIN_ACCOUNT.password}</div>
    </div>
  </div></div>;
}
