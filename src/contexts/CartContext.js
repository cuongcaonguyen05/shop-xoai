import { createContext, useContext, useState, useCallback } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem('shop_cart')) || []; }
    catch { return []; }
  });

  // checked: { [productId]: bool } — persist qua localStorage
  const [checked, setChecked] = useState(() => {
    try { return JSON.parse(localStorage.getItem('shop_cart_checked')) || {}; }
    catch { return {}; }
  });

  const addToCart = useCallback((product, qty = 1) => {
    const id = product._id;
    setItems(prev => {
      const idx = prev.findIndex(i => i.productId === id);
      let next;
      if (idx >= 0) {
        next = prev.map((i, index) =>
          index === idx ? { ...i, qty: i.qty + qty } : i
        );
      } else {
        next = [...prev, {
          productId: id,
          name:      product.name,
          price:     product.price,
          old_price: product.old_price || null,
          image:     product.image || '',
          qty,
        }];
      }
      localStorage.setItem('shop_cart', JSON.stringify(next));
      return next;
    });
    // Sản phẩm mới hoặc đang unchecked → check lại
    setChecked(prev => {
      if (prev[id] === true) return prev; // đã check rồi, giữ nguyên
      const next = { ...prev, [id]: true };
      localStorage.setItem('shop_cart_checked', JSON.stringify(next));
      return next;
    });
  }, []);

  const updateQty = useCallback((productId, qty) => {
    if (qty < 1) return;
    setItems(prev => {
      const next = prev.map(i => i.productId === productId ? { ...i, qty } : i);
      localStorage.setItem('shop_cart', JSON.stringify(next));
      return next;
    });
  }, []);

  const removeItem = useCallback((productId) => {
    setItems(prev => {
      const next = prev.filter(i => i.productId !== productId);
      localStorage.setItem('shop_cart', JSON.stringify(next));
      return next;
    });
    setChecked(prev => {
      const next = { ...prev };
      delete next[productId];
      localStorage.setItem('shop_cart_checked', JSON.stringify(next));
      return next;
    });
  }, []);

  const toggleChecked = useCallback((productId) => {
    setChecked(prev => {
      const next = { ...prev, [productId]: !prev[productId] };
      localStorage.setItem('shop_cart_checked', JSON.stringify(next));
      return next;
    });
  }, []);

  const setAllChecked = useCallback((value) => {
    setChecked(prev => {
      const next = Object.fromEntries(Object.keys(prev).map(k => [k, value]));
      localStorage.setItem('shop_cart_checked', JSON.stringify(next));
      return next;
    });
  }, []);

  // Đảm bảo item mới (chưa có trong checked) mặc định là true
  const checkedWithDefaults = { ...checked };
  items.forEach(i => {
    if (checkedWithDefaults[i.productId] === undefined) checkedWithDefaults[i.productId] = true;
  });

  const totalQty   = items.reduce((s, i) => s + i.qty, 0);
  const totalPrice = items.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <CartContext.Provider value={{
      items, checked: checkedWithDefaults,
      addToCart, updateQty, removeItem,
      toggleChecked, setAllChecked,
      totalQty, totalPrice,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
