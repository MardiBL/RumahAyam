import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-black text-white-#d4d4d4 p-12 mt-10">
      <div className="container">
        <div className="footer-grid">
          <div>
            <h3>🐔 AyamKu</h3>
            <p>
              Platform belanja ayam segar untuk kebutuhan rumah tangga,
              restoran, dan usaha kuliner.
            </p>
          </div>
          <div>
            <h3>Menu</h3>
            <ul>
              <li>
                <Link href="/produk">Semua Produk</Link>
              </li>
              <li>
                <Link href="/tentang">Tentang Kami</Link>
              </li>
              <li>
                <Link href="/kontak">Kontak</Link>
              </li>
              <li>
                <Link href="/akun">Akun Saya</Link>
              </li>
            </ul>
          </div>
          <div>
            <h3>Kontak</h3>
            <p>
              📍 Tangerang, Banten
              <br />☎ 0812-3456-7890
              <br />✉ halo@ayamku.id
            </p>
          </div>
        </div>
        <div className="footer-bottom">
          © 2026 AyamKu. Semua hak dilindungi.
        </div>
      </div>
    </footer>
  );
}
