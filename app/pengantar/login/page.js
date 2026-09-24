"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCourier } from "@/context/CourierContext";

export default function CourierLoginPage() {
  const router = useRouter();
  const { login, courier, hydrated } = useCourier();
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    if (hydrated && courier) router.replace("/pengantar");
  }, [hydrated, courier, router]);

  function submit(event) {
    event.preventDefault();
    setErr("");
    if (!login(phone, code)) {
      setErr("Nomor WhatsApp atau kode konfirmasi tidak valid / akses sudah dicabut.");
      return;
    }
    router.replace("/pengantar");
  }

  if (!hydrated || courier) return <main className="min-h-[70vh] bg-gray-50 px-4 py-12"><div className="mx-auto max-w-lg animate-pulse rounded-2xl border border-gray-200 bg-white p-8 shadow-sm"><div className="mx-auto mb-4 h-12 w-12 rounded-xl bg-gray-200" /><div className="mx-auto h-6 w-48 rounded bg-gray-200" /><div className="mx-auto mt-3 h-4 w-72 max-w-full rounded bg-gray-100" /></div></main>;

  return (
    <main className="min-h-[70vh] bg-gray-50 px-4 py-10 sm:py-16">
      <div className="mx-auto max-w-lg">
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="bg-red-600 px-6 py-7 text-white sm:px-8">
            <p className="text-sm font-semibold uppercase tracking-wider text-red-100">Akses Pengantar</p>
            <h1 className="mt-1 text-2xl font-bold sm:text-3xl">Login Pengantar</h1>
            <p className="mt-2 text-sm leading-6 text-red-100">Gunakan nomor WhatsApp dan kode konfirmasi yang diberikan admin.</p>
          </div>
          <form onSubmit={submit} className="space-y-5 p-6 sm:p-8">
            <div><label htmlFor="phone" className="mb-2 block text-sm font-semibold text-gray-700">Nomor WhatsApp</label><input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="08xxxxxxxxxx" inputMode="tel" autoComplete="tel" required className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-red-500 focus:ring-4 focus:ring-red-100" /></div>
            <div><label htmlFor="code" className="mb-2 block text-sm font-semibold text-gray-700">Kode Konfirmasi</label><input id="code" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="Contoh: AYAM-1234" autoComplete="one-time-code" required className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm uppercase outline-none transition focus:border-red-500 focus:ring-4 focus:ring-red-100" /></div>
            {err && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-5 text-red-700">{err}</div>}
            <button type="submit" className="w-full rounded-xl bg-red-600 px-5 py-3 font-bold text-white transition hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-100">Masuk sebagai Pengantar</button>
          </form>
        </div>
      </div>
    </main>
  );
}
