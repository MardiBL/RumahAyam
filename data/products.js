export const products = [
  {
    id: 1,
    name: "Ayam Broiler",
    category: "Ayam Broiler",
    price: 32000,
    unit: "kg",
    stock: 25,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=900&q=80",
    description: "Ayam broiler pilihan dengan daging lembut, segar dan higienis. Cocok untuk berbagai kebutuhan masakan keluarga."
  },
  {
    id: 2,
    name: "Ayam Kampung",
    category: "Ayam Kampung",
    price: 65000,
    unit: "kg",
    stock: 12,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1518492104633-130d0cc84637?auto=format&fit=crop&w=900&q=80",
    description: "Ayam kampung segar dengan tekstur daging lebih padat dan cita rasa gurih."
  },
  {
    id: 3,
    name: "Dada Ayam",
    category: "Dada Ayam",
    price: 45000,
    unit: "kg",
    stock: 18,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?auto=format&fit=crop&w=900&q=80",
    description: "Dada ayam segar dan rendah lemak, cocok untuk menu harian, meal prep, dan kebutuhan usaha."
  },
  {
    id: 4,
    name: "Paha Ayam",
    category: "Paha Ayam",
    price: 38000,
    unit: "kg",
    stock: 20,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1587593810167-a84920ea0781?auto=format&fit=crop&w=900&q=80",
    description: "Paha ayam segar dengan tekstur juicy dan rasa gurih."
  },
  {
    id: 5,
    name: "Sayap Ayam",
    category: "Sayap Ayam",
    price: 28000,
    unit: "kg",
    stock: 15,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1527477396000-e27163b481c2?auto=format&fit=crop&w=900&q=80",
    description: "Sayap ayam segar untuk goreng, bakar, barbeque, dan berbagai hidangan favorit."
  },
  {
    id: 6,
    name: "Ceker Ayam",
    category: "Ceker Ayam",
    price: 25000,
    unit: "kg",
    stock: 16,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=900&q=80",
    description: "Ceker ayam bersih dan segar untuk sup, dimsum, seblak, dan menu lainnya."
  },
  {
    id: 7,
    name: "Ati Ampela",
    category: "Ati Ampela",
    price: 22000,
    unit: "kg",
    stock: 14,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=900&q=80",
    description: "Ati ampela segar yang sudah diproses secara higienis dan siap diolah."
  },
  {
    id: 8,
    name: "Kulit Ayam",
    category: "Kulit Ayam",
    price: 19000,
    unit: "kg",
    stock: 10,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=900&q=80",
    description: "Kulit ayam segar untuk olahan crispy, sate, dan aneka makanan."
  }
];

export const categories = [
  "Semua",
  "Ayam Broiler",
  "Ayam Kampung",
  "Dada Ayam",
  "Paha Ayam",
  "Sayap Ayam",
  "Ceker Ayam",
  "Ati Ampela",
  "Kulit Ayam"
];

export function getProduct(id) {
  return products.find((product) => product.id === Number(id));
}
