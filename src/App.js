import { Routes, Route } from 'react-router-dom';
import Layout from './Components/Layout';
import HomePage from './HomePage';
import AdminPage from './AdminPage';
import ProductDetail from './UI/ProductDetail';
import AboutPage from './UI/AboutPage';
import ContactPage from './UI/ContactPage';
import NewsPage from './UI/NewsPage';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/"                element={<HomePage />} />
        <Route path="/san-pham/:id"    element={<ProductDetail />} />
        <Route path="/gioi-thieu"      element={<AboutPage />} />
        <Route path="/lien-he"         element={<ContactPage />} />
        <Route path="/tin-tuc"         element={<NewsPage />} />
      </Route>
      <Route path="/admin" element={<AdminPage />} />
    </Routes>
  );
}

export default App;