import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import CartPanel from './components/CartPanel';
import HomePage from './pages/HomePage';
import ProductListingPage from './pages/ProductListingPage';
import ProductDetailPage from './pages/ProductDetailPage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          {/* Persistent Shell */}
          <Navbar />
          <CartPanel />

          {/* Routes */}
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductListingPage />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            {/* Fallback */}
            <Route path="*" element={
              <div className="min-h-screen bg-dark-bg flex flex-col items-center justify-center gap-4">
                <p className="font-display text-7xl text-neon tracking-widest">404</p>
                <p className="text-white/30 uppercase tracking-widest text-sm">Page Not Found</p>
                <a href="/" className="btn-primary text-sm mt-4">Go Home</a>
              </div>
            } />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
