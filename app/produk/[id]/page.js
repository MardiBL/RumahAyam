import { notFound } from "next/navigation";
import ProductDetailClient from "@/components/ProductDetailClient";
import { getProduct } from "@/data/products";

export default async function ProductDetailPage({ params }) {
  const { id } = await params;
  const product = getProduct(id);

  if (!product) notFound();

  return <ProductDetailClient product={product} />;
}
