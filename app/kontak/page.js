import Footer from "@/components/Footer";

export default function ContactPage() {
  return (
    <>
      <div className="page">
        <div className="container" style={{maxWidth:900}}>
          <div className="section-head"><div><h2>Hubungi Kami</h2><p>Punya pertanyaan? Kirim pesan kepada tim AyamKu.</p></div></div>
          <div className="cart-layout">
            <div className="panel">
              <h3>Kirim Pesan</h3>
              <div className="form-group"><label>Nama</label><input className="input" placeholder="Nama lengkap"/></div>
              <div className="form-group"><label>Email</label><input className="input" type="email" placeholder="nama@email.com"/></div>
              <div className="form-group"><label>Pesan</label><textarea className="input" rows="6" placeholder="Tulis pesan Anda..." style={{resize:"vertical"}}/></div>
              <button className="btn btn-primary">Kirim Pesan</button>
            </div>
            <div className="panel">
              <h3>Informasi Kontak</h3>
              <p style={{color:"#666",lineHeight:1.8}}>📍 Tangerang, Banten<br/><br/>☎ 0812-3456-7890<br/><br/>✉ halo@ayamku.id<br/><br/>🕘 Senin - Minggu, 08.00 - 21.00</p>
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </>
  );
}
