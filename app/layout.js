import "./globals.css";
import {CartProvider} from "@/context/CartContext";
import {UserProvider} from "@/context/UserContext";
import {AdminProvider} from "@/context/AdminContext";
import {OrderProvider} from "@/context/OrderContext";
import {CourierProvider} from "@/context/CourierContext";
import Header from "@/components/Header";
export const metadata={title:"AyamKu — Ayam Segar Berkualitas",description:"Toko ayam segar online."};
export default function RootLayout({children}){return <html lang="id" data-scroll-behavior="smooth"><body><OrderProvider><UserProvider><AdminProvider><CourierProvider><CartProvider><Header/>{children}</CartProvider></CourierProvider></AdminProvider></UserProvider></OrderProvider></body></html>}
