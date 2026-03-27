import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import './NewsPage.css';

const NEWS_CATS = [
  { value: 'all',    label: 'Tất cả',              icon: '📰' },
  { value: 'info',   label: 'Thông tin hữu ích',   icon: '📋' },
  { value: 'recipe', label: 'Công thức món ăn',    icon: '🍳' },
];

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '';

export default function NewsPage() {
  const [searchParams] = useSearchParams();
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [selected, setSelected] = useState(null); // bài đang đọc

  const activeCat = searchParams.get('category') || 'all';

  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:5000/api/news')
      .then(r => r.json())
      .then(data => setNewsList(Array.isArray(data) ? data : []))
      .catch(() => setNewsList([]))
      .finally(() => setLoading(false));
  }, []);

  // Khi URL thay đổi category → đóng bài đang đọc
  useEffect(() => { setSelected(null); }, [activeCat]);

  const filtered = activeCat === 'all'
    ? newsList
    : newsList.filter(n => n.category === activeCat);

  const catInfo = NEWS_CATS.find(c => c.value === activeCat) || NEWS_CATS[0];

  return (
    <div className="news-root">

      <div className="news-body">

        {/* CHI TIẾT BÀI VIẾT */}
        {selected ? (
          <div className="news-detail-wrap">
            <button className="news-back-btn" onClick={() => setSelected(null)}>← Quay lại danh sách</button>

            <div className="news-detail">
              <div className="news-detail-meta">
                <span className={`news-cat-badge ${selected.category}`}>
                  {NEWS_CATS.find(c => c.value === selected.category)?.icon} {NEWS_CATS.find(c => c.value === selected.category)?.label}
                </span>
                <span className="news-detail-date">📅 {fmtDate(selected.createdAt)}</span>
              </div>
              <h1 className="news-detail-title">{selected.title}</h1>
              <div className="news-detail-author">✍️ {selected.author || 'Shop mẹ Thủy'}</div>

              <div className="news-detail-content">
                {selected.content
                  ? selected.content.split('\n').map((line, i) =>
                      line.trim() === '' ? <br key={i} /> : <p key={i}>{line}</p>
                    )
                  : <p className="news-no-content">Bài viết đang được cập nhật...</p>
                }
              </div>

              {/* BÌNH LUẬN */}
              <div className="news-comments">
                <h3 className="news-comments-title">
                  💬 Bình luận ({selected.comments?.length || 0})
                </h3>
                {selected.comments?.length === 0 ? (
                  <div className="news-no-comment">Chưa có bình luận. Hãy là người đầu tiên!</div>
                ) : (
                  <div className="news-comment-list">
                    {selected.comments.map(c => (
                      <div key={c._id} className="news-comment-item">
                        <div className="news-comment-avatar">{(c.author || 'A')[0].toUpperCase()}</div>
                        <div className="news-comment-body">
                          <div className="news-comment-header">
                            <strong>{c.author || 'Ẩn danh'}</strong>
                            <span>{fmtDate(c.createdAt)}</span>
                          </div>
                          <p>{c.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* DANH SÁCH BÀI */
          <div className="news-list-wrap">
            <div className="news-section-title">
              {catInfo.icon} {catInfo.label}
              <span className="news-section-count">{filtered.length} bài viết</span>
            </div>

            {loading ? (
              <div className="news-loading">
                <div className="news-spinner" />
                <p>Đang tải bài viết...</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="news-empty">
                <div className="news-empty-icon">📭</div>
                <p>Chưa có bài viết nào trong mục này</p>
              </div>
            ) : (
              <div className="news-grid">
                {filtered.map((n, idx) => {
                  const nc = NEWS_CATS.find(c => c.value === n.category);
                  const preview = n.content ? n.content.slice(0, 120) + (n.content.length > 120 ? '…' : '') : 'Xem chi tiết bài viết...';
                  return (
                    <div key={n._id} className={`news-card ${idx === 0 && activeCat === 'all' ? 'news-card-featured' : ''}`}
                      onClick={() => setSelected(n)}>
                      <div className="news-card-top">
                        <span className={`news-cat-badge ${n.category}`}>{nc?.icon} {nc?.label}</span>
                        <span className="news-card-date">{fmtDate(n.createdAt)}</span>
                      </div>
                      <h2 className="news-card-title">{n.title}</h2>
                      <p className="news-card-preview">{preview}</p>
                      <div className="news-card-footer">
                        <span className="news-card-author">✍️ {n.author || 'Shop mẹ Thủy'}</span>
                        <span className="news-card-comments">💬 {n.comments?.length || 0}</span>
                        <span className="news-read-more">Đọc tiếp →</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  );
}
