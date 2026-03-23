import { Routes, Route } from 'react-router-dom';
import HomePage from './UI/HomePage';

function App() {
  return (
    <Routes>
      <Route path="/"            element={<HomePage />} />
      <Route path="/gioi-thieu"  element={<div>Trang Giới thiệu</div>} />
      <Route path="/san-pham"    element={<div>Trang Sản phẩm</div>} />
      <Route path="/tin-tuc"     element={<div>Trang Tin tức</div>} />
      <Route path="/lien-he"     element={<div>Trang Liên hệ</div>} />
    </Routes>
  );
}

export default App;