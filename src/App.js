import { Routes, Route } from 'react-router-dom';
import Layout from './Components/Layout';
import HomePage from './HomePage';
import AdminPage from './AdminPage';
import ProductDetail from './UI/ProductDetail';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/"                element={<HomePage />} />
        <Route path="/san-pham/:id"    element={<ProductDetail />} />
      </Route>
      <Route path="/admin" element={<AdminPage />} />
    </Routes>
  );
}

export default App;