import { Suspense } from "react";
import QrisContent from "./QurisContent";

export default function QrisPage() {
  return (
    <Suspense
      fallback={
        <div className="page">
          <div className="container empty">
            <h2>Memuat pembayaran...</h2>
          </div>
        </div>
      }
    >
      <QrisContent />
    </Suspense>
  );
}