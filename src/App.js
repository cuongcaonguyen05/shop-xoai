import { Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './Components/Layout';
import HomePage from './HomePage';
import AdminPage from './AdminPage';
import ProductDetail from './UI/ProductDetail';
import AboutPage from './UI/AboutPage';
import ContactPage from './UI/ContactPage';
import NewsPage from './UI/NewsPage';
import LoginModal from './Components/LoginModal';

const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || '';

function AppInner() {
  return (
    <AuthProvider>
      <LoginModal />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/"             element={<HomePage />} />
          <Route path="/san-pham/:id" element={<ProductDetail />} />
          <Route path="/gioi-thieu"   element={<AboutPage />} />
          <Route path="/lien-he"      element={<ContactPage />} />
          <Route path="/tin-tuc"      element={<NewsPage />} />
        </Route>
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
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
