import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AddressTab from './AddressTab';
import OrdersTab  from './OrdersTab';
import './AccountPage.css';

const TABS = [
  { id: 'orders',    label: '📦 Đơn hàng của tôi' },
  { id: 'addresses', label: '📍 Địa chỉ giao hàng' },
];

export default function AccountPage() {
  const { user, setLoginOpen } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'orders');

  useEffect(() => {
    if (!user) { setLoginOpen(true); navigate('/'); }
  }, [user, navigate, setLoginOpen]);

  if (!user) return null;

  return (
    <div className="acc-root">
      <div className="acc-inner">
        {/* SIDEBAR */}
        <div className="acc-sidebar">
          <div className="acc-profile">
            {user.avatar
              ? <img src={user.avatar} alt={user.name} className="acc-avatar" />
              : <div className="acc-avatar acc-avatar-fallback">{user.name[0].toUpperCase()}</div>
            }
            <div>
              <div className="acc-profile-name">{user.name}</div>
              <div className="acc-profile-sub">{user.phone || user.email || ''}</div>
            </div>
          </div>

          <nav className="acc-nav">
            {TABS.map(t => (
              <button
                key={t.id}
                className={`acc-nav-item ${activeTab === t.id ? 'acc-nav-item--active' : ''}`}
                onClick={() => setActiveTab(t.id)}
              >
                {t.label}
              </button>
            ))}
          </nav>
        </div>

        {/* NỘI DUNG TAB */}
        <div className="acc-main">
          {activeTab === 'orders'    && <OrdersTab />}
          {activeTab === 'addresses' && <AddressTab />}
        </div>
      </div>
    </div>
  );
}
