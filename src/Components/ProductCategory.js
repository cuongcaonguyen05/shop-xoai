import { useState } from 'react';
import './ProductCategory.css';

import img_menu_icon_chair from '../Resource/menu_icon_chair.webp';
import img_menu_icon_pot_and_pan_grinder from '../Resource/menu_icon_pot_and_pan_grinder.webp';
import img_menu_icon_kitchen_utensils from '../Resource/menu_icon_kitchen_utensils.webp';
import img_menu_icon_eating_utensils from '../Resource/menu_icon_eating_utensils.webp';
import img_menu_icon_for_postpartum_mothers from '../Resource/menu_icon_for_postpartum_mothers.webp';
import img_menu_icon_spice from '../Resource/menu_icon_spice.webp';
import img_menu_icon_instant_food from '../Resource/menu_icon_instant_food.webp';
import img_menu_icon_organic_grains_and_flour from '../Resource/menu_icon_organic_grains_and_flour.webp';
import img_menu_icon_noodles_and_vermicelli from '../Resource/menu_icon_noodles_and_vermicelli.webp';
import img_menu_icon_milk_and_vitamins from '../Resource/menu_icon_milk_and_vitamins.webp';
import img_menu_icon_educational_toys from '../Resource/menu_icon_educational_toys.webp';

import img_menu_icon_delivery_policy from '../Resource/menu_icon_delivery_policy.webp';
import img_menu_icon_return_policy from '../Resource/menu_icon_return_policy.webp';
import img_menu_icon_attractive_offers from '../Resource/menu_icon_attractive_offers.webp';
import img_menu_icon_phone from '../Resource/menu_icon_phone.webp';

// ── Import ảnh icon từ thư mục Resource ──
// Bạn đặt ảnh icon vào src/Resource/ rồi import theo tên file thực tế
// Ví dụ: import icGhe from '../Resource/ic_ghe_an_dam.png';
// Hiện tại dùng emoji làm placeholder, thay bằng <img src={icGhe} /> khi có ảnh

const categories = [
  {
    label: 'Ghế ăn dặm',
    value: 'chair',                              // ← thêm
    imgSrc: img_menu_icon_chair,
    sub: [],
  },
  {
    label: 'Máy xay, nồi chảo',
    value: 'pot_and_pan_grinder',                            // ← thêm
    imgSrc: img_menu_icon_pot_and_pan_grinder,
    sub: ['Máy xay', 'Nồi chảo'],
  },
  {
    label: 'Đồ dùng bếp',
    value: 'kitchen',                            // ← thêm
    imgSrc: img_menu_icon_kitchen_utensils,
    sub: ['Dụng cụ làm bếp', 'Hộp, khay trữ thực phẩm', 'Các loại khuôn tạo hình', 'Cân'],
  },
  {
    label: 'Dụng cụ ăn uống',
    value: 'utensils',                           // ← thêm
    imgSrc: img_menu_icon_eating_utensils,
    sub: ['Khay, bát, thìa', 'Yếm', 'Bình nước', 'Phụ kiện cho bé'],
  },
  {
    label: 'Dành cho mẹ sau sinh',
    value: 'postpartum',                         // ← thêm
    imgSrc: img_menu_icon_for_postpartum_mothers,
    sub: [],
  },
  {
    label: 'Gia vị ăn dặm',
    value: 'spice',                              // ← thêm
    imgSrc: img_menu_icon_spice,
    sub: [],
  },
  {
    label: 'Thực phẩm ăn liền',
    value: 'instant_food',                       // ← thêm
    imgSrc: img_menu_icon_instant_food,
    sub: [],
  },
  {
    label: 'Các loại bột, hạt hữu cơ',
    value: 'organic_flour',                      // ← thêm
    imgSrc: img_menu_icon_organic_grains_and_flour,
    sub: [],
  },
  {
    label: 'Nui, mì, bún',
    value: 'noodles',                            // ← thêm
    imgSrc: img_menu_icon_noodles_and_vermicelli,
    sub: [],
  },
  {
    label: 'Sữa, men vi sinh, vitamin',
    value: 'milk',                               // ← thêm
    imgSrc: img_menu_icon_milk_and_vitamins,
    sub: [],
  },
  {
    label: 'Đồ chơi giáo dục',
    value: 'toys',                               // ← thêm
    imgSrc: img_menu_icon_educational_toys,
    sub: [],
  }
];

const policies = [
  { label: 'Chính sách giao hàng', imgSrc: img_menu_icon_delivery_policy },
  { label: 'Chính sách đổi trả',   imgSrc: img_menu_icon_return_policy },
  { label: 'Ưu đãi hấp dẫn mỗi ngày', imgSrc: img_menu_icon_attractive_offers },
];

// ══════════════════════════════════════
// COMPONENT CHÍNH
// Props:
//   active    — tên danh mục đang chọn (string)
//   onSelect  — hàm gọi khi người dùng click chọn danh mục
// ══════════════════════════════════════
export default function ProductCategory({ active, onSelect }) {
  const [openIndex, setOpenIndex] = useState(null);

  const handleToggle = (i) => {
    setOpenIndex(prev => (prev === i ? null : i));
  };

  return (
    <aside className="csb-root">

      {/* HEADER */}
      <div className="csb-header">
        <span className="csb-header-icon">☰</span>
        DANH MỤC SẢN PHẨM
      </div>

      {/* DANH SÁCH DANH MỤC */}
      <ul className="csb-list">
        {categories.map((cat, i) => (
          <li key={i}>
            {/* ITEM CHÍNH */}
            <div
              className={`csb-item ${active === cat.value ? 'csb-item--active' : ''}`}
              onClick={() => {
                onSelect(cat.value);
                if (cat.sub.length > 0) handleToggle(i);
              }}
            >
              {/* ICON — thay span thành <img> khi có ảnh thật */}
              <span className="csb-icon">
                {cat.imgSrc
                  ? <img src={cat.imgSrc} alt={cat.label} />
                  : cat.icon
                }
              </span>

              <span className="csb-label">{cat.label}</span>

              {/* MŨI TÊN nếu có sub-items */}
              {cat.sub.length > 0 && (
                <span className="csb-arrow">
                  {openIndex === i ? '▾' : '›'}
                </span>
              )}
            </div>

            {/* SUB-ITEMS — hiện ra khi mở */}
            {openIndex === i && cat.sub.length > 0 && (
              <ul className="csb-sub">
                {cat.sub.map((s, j) => (
                  <li
                    key={j}
                    className="csb-sub-item"
                    onClick={() => onSelect(s)}
                  >
                    › {s}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>

      {/* ĐƯỜNG KẺ PHÂN CÁCH */}
      <div className="csb-divider" />

      {/* CHÍNH SÁCH */}
      <ul className="csb-list">
        {policies.map((p, i) => (
          <li key={i}>
            <div className="csb-item">
              <span className="csb-icon">
                {p.imgSrc && <img src={p.imgSrc} alt={p.label} />}
              </span>
              <span className="csb-label">{p.label}</span>
            </div>
          </li>
        ))}
      </ul>

      {/* HOTLINE */}
      <div className="csb-hotline">
        <span className="csb-hotline-icon">
            <img src={img_menu_icon_phone} alt="Hotline" />
        </span>
        <div>
          <strong>Gọi mua hàng: 0365414845 - mr. Cường</strong>
          <p>(8:00 – 17:30 T2 – CN)</p>
        </div>
      </div>

    </aside>
  );
}