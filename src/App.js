import { Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import Layout from './Components/Layout';
import HomePage from './HomePage';
import AdminPage from './AdminPage';
import ProductDetail from './UI/ProductDetail';
import AboutPage from './UI/AboutPage';
import ContactPage from './UI/ContactPage';
import NewsPage from './UI/NewsPage';
import CartPage from './UI/CartPage';
import CheckoutPage  from './UI/CheckoutPage';
import AccountPage   from './UI/AccountPage';
import LoginModal from './Components/LoginModal';

const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || '';

function AppInner() {
  return (
    <AuthProvider>
      <CartProvider>
        <LoginModal />
        <Routes>
          <Route element={<Layout />}>
            <Route path="/"             element={<HomePage />} />
            <Route path="/san-pham/:id" element={<ProductDetail />} />
            <Route path="/gioi-thieu"   element={<AboutPage />} />
            <Route path="/lien-he"      element={<ContactPage />} />
            <Route path="/tin-tuc"      element={<NewsPage />} />
            <Route path="/gio-hang"     element={<CartPage />} />
            <Route path="/dat-hang"     element={<CheckoutPage />} />
            <Route path="/tai-khoan"    element={<AccountPage />} />
          </Route>
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </CartProvider>
    </AuthProvider>
  );
}

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID || 'not-configured'}>
      <AppInner />
    </GoogleOAuthProvider>
  );
}

export default App;
