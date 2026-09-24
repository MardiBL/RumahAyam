import Footer from "@/components/Footer";

export default function AboutPage() {
  return (
    <>
      <div className="page">
        <div className="container" style={{maxWidth:900}}>
          <span className="eyebrow">Tentang AyamKu</span>
          <h1 style={{fontSize:44,margin:"10px 0 18px"}}>Ayam segar, mudah dipesan, sampai ke rumah.</h1>
          <p style={{color:"#666",lineHeight:1.9,fontSize:17}}>AyamKu adalah konsep e-commerce ayam segar yang mempertemukan pelanggan dengan produk ayam berkualitas melalui pengalaman belanja yang sederhana, cepat, dan transparan.</p>
          <div className="features" style={{gridTemplateColumns:"repeat(3,1fr)",marginTop:35}}>
            <div className="panel"><h3>Kualitas</h3><p style={{color:"#777",lineHeight:1.6}}>Produk dipilih dan diproses dengan standar kebersihan yang baik.</p></div>
            <div className="panel"><h3>Harga</h3><p style={{color:"#777",lineHeight:1.6}}>Harga dibuat kompetitif untuk kebutuhan rumah dan bisnis.</p></div>
            <div className="panel"><h3>Layanan</h3><p style={{color:"#777",lineHeight:1.6}}>Pesanan dikemas dengan baik dan dikirim sesuai pilihan pelanggan.</p></div>
          </div>
        </div>
      </div>
      <Footer/>
    </>
  );
}
