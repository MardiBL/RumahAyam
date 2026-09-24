"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Edit3, Trash2, Plus, MapPin, LogOut } from "lucide-react";
import { useUser } from "@/context/UserContext";

const empty = {
  label: "Rumah",
  recipient: "",
  phone: "",
  address: "",
  city: "",
  note: "",
  isMain: false,
};
export default function ProfilePage() {
  const router = useRouter();
  const {
    user,
    addresses,
    updateProfile,
    logout,
    addAddress,
    updateAddress,
    deleteAddress,
    setMainAddress,
  } = useUser();
  const [form, setForm] = useState(
    user
      ? { fullName: user.fullName, alias: user.alias, phone: user.phone }
      : { fullName: "", alias: "", phone: "" },
  );
  const [addressForm, setAddressForm] = useState(empty);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  if (!user)
    return (
      <div className="page">
        <div className="container empty">
          <h2>Silakan masuk terlebih dahulu.</h2>
          <button
            className="btn btn-primary"
            onClick={() => router.push("/login")}
          >
            Masuk
          </button>
        </div>
      </div>
    );
  function saveProfile(e) {
    e.preventDefault();
    updateProfile(form);
    alert("Profil berhasil diperbarui.");
  }
  function saveAddress(e) {
    e.preventDefault();
    if (!addressForm.recipient || !addressForm.phone || !addressForm.address) {
      alert("Nama penerima, nomor WA, dan alamat wajib diisi.");
      return;
    }
    if (editing) updateAddress(editing, addressForm);
    else addAddress(addressForm);
    setAddressForm(empty);
    setEditing(null);
    setShowForm(false);
  }
  function edit(a) {
    setEditing(a.id);
    setAddressForm(a);
    setShowForm(true);
  }
  return (
    <div className="page">
      <div className="container">
        <div className="profile-layout">
          <aside className="profile-sidebar">
          
            <button
              className="dash-link"
              onClick={() => router.push("/akun")}
            >
              Pesanan Saya
            </button>
            <button
              className="dash-link"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              Profile
            </button>
            <button
              className="dash-link"
              onClick={() => {
                logout();
                router.push("/");
              }}
            >
              <LogOut size={16} /> Keluar
            </button>
          </aside>
          <section>
            <div className="panel">
              <h2>Profile</h2>
              <p style={{ color: "#888" }}>
                Nama lengkap, alias, dan nomor WhatsApp aktif.
              </p>
              <form onSubmit={saveProfile}>
                <div className="form-group">
                  <label>Nama Lengkap</label>
                  <input
                    className="input"
                    value={form.fullName}
                    onChange={(e) =>
                      setForm({ ...form, fullName: e.target.value })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Nama Alias / Panggilan</label>
                  <input
                    className="input"
                    value={form.alias}
                    onChange={(e) =>
                      setForm({ ...form, alias: e.target.value })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Nomor WA</label>
                  <input
                    className="input"
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                  />
                </div>
                <button className="btn btn-primary">Simpan Profile</button>
              </form>
            </div>
            <div className="panel" style={{ marginTop: 20 }}>
              <div className="section-head">
                <div>
                  <h2>Alamat Saya</h2>
                  <p>Atur alamat utama dan nomor yang dapat dihubungi kurir.</p>
                </div>
                <button
                  className="btn btn-primary flex items-center"
                  onClick={() => {
                    setAddressForm({
                      ...empty,
                      recipient: user.fullName,
                      phone: user.phone,
                    });
                    setEditing(null);
                    setShowForm(true);
                  }}
                >
                  <Plus size={15} /> Tambah Alamat
                </button>
              </div>
              {showForm && (
                <form className="address-form" onSubmit={saveAddress}>
                  <div className="address-form-grid">
                    <div className="form-group">
                      <label>Label</label>
                      <input
                        className="input"
                        value={addressForm.label}
                        onChange={(e) =>
                          setAddressForm({
                            ...addressForm,
                            label: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label>Nama yang Dihubungi</label>
                      <input
                        className="input"
                        value={addressForm.recipient}
                        onChange={(e) =>
                          setAddressForm({
                            ...addressForm,
                            recipient: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label>Nomor WA yang Dihubungi</label>
                      <input
                        className="input"
                        value={addressForm.phone}
                        onChange={(e) =>
                          setAddressForm({
                            ...addressForm,
                            phone: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="form-group full">
                      <label>Alamat Lengkap</label>
                      <textarea
                        className="input"
                        rows="3"
                        value={addressForm.address}
                        onChange={(e) =>
                          setAddressForm({
                            ...addressForm,
                            address: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label>Kota / Kecamatan</label>
                      <input
                        className="input"
                        value={addressForm.city}
                        onChange={(e) =>
                          setAddressForm({
                            ...addressForm,
                            city: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label>Catatan Kurir</label>
                      <input
                        className="input"
                        value={addressForm.note}
                        onChange={(e) =>
                          setAddressForm({
                            ...addressForm,
                            note: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <label
                    style={{
                      display: "flex",
                      gap: 8,
                      alignItems: "center",
                      fontSize: 13,
                      marginBottom: 15,
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={!!addressForm.isMain}
                      onChange={(e) =>
                        setAddressForm({
                          ...addressForm,
                          isMain: e.target.checked,
                        })
                      }
                    />{" "}
                    Jadikan alamat utama
                  </label>
                  <button className="btn btn-primary">
                    {editing ? "Simpan Perubahan" : "Simpan Alamat"}
                  </button>
                  <button
                    type="button"
                    className="btn btn-light"
                    style={{ marginLeft: 8 }}
                    onClick={() => {
                      setShowForm(false);
                      setEditing(null);
                    }}
                  >
                    Batal
                  </button>
                </form>
              )}
              {!addresses.length && !showForm && (
                <div className="empty compact">
                  <MapPin size={35} />
                  <p>Belum ada alamat. Tambahkan alamat untuk checkout.</p>
                </div>
              )}
              {addresses.map((a) => (
                <div
                  className={`address-card ${a.isMain ? "main-address" : ""}`}
                  key={a.id}
                >
                  <div>
                    <div className="address-title">
                      <b>{a.label}</b>
                      {a.isMain && (
                        <span className="main-badge">Alamat Utama</span>
                      )}
                    </div>
                    <strong>Nama :{a.recipient}</strong>
                    <div>
                      {" "}
                      No.Wa:{" "}
                      <a
                        href={`https://wa.me/${a.phone.replace(/^0/, "62")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600 hover:underline"
                      >
                        {a.phone}
                      </a>
                    </div>

                    <p>
                      Alamat: {a.address}
                      {a.city ? `, ${a.city}` : ""}
                    </p>
                    {a.note && <small>Catatan: {a.note}</small>}
                  </div>
                  <div className="address-actions">
                    <button
                      className="icon-btn"
                      title="Edit"
                      onClick={() => edit(a)}
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      className="icon-btn"
                      title="Hapus"
                      onClick={() => deleteAddress(a.id)}
                    >
                      <Trash2 size={16} color="#dc2626" />
                    </button>
                    {!a.isMain && (
                      <button
                        className="btn btn-light"
                        style={{ fontSize: 11, padding: "7px 10px" }}
                        onClick={() => setMainAddress(a.id)}
                      >
                        Jadikan Utama
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
