import './AboutPage.css';

const stats = [
  { number: '5.000+', label: 'Sản phẩm', icon: '📦' },
  { number: '50.000+', label: 'Khách hàng tin dùng', icon: '👨‍👩‍👧' },
  { number: '8 năm', label: 'Kinh nghiệm', icon: '🏆' },
  { number: '99%', label: 'Hàng chính hãng', icon: '✅' },
];

const values = [
  {
    icon: '🌿',
    title: 'An toàn tuyệt đối',
    desc: 'Tất cả sản phẩm đều được kiểm định chất lượng nghiêm ngặt, đảm bảo an toàn tuyệt đối cho bé yêu của bạn.',
  },
  {
    icon: '💝',
    title: 'Tận tâm với mẹ & bé',
    desc: 'Chúng tôi hiểu rằng mỗi đứa trẻ là duy nhất. Đội ngũ tư vấn của chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7.',
  },
  {
    icon: '🚀',
    title: 'Giao hàng nhanh chóng',
    desc: 'Giao hàng toàn quốc trong 24–48 giờ. Miễn phí vận chuyển cho đơn hàng từ 300.000đ trở lên.',
  },
  {
    icon: '🔄',
    title: 'Đổi trả dễ dàng',
    desc: 'Chính sách đổi trả trong 30 ngày không cần lý do. Hoàn tiền 100% nếu sản phẩm không đúng mô tả.',
  },
];

const team = [
  { name: 'Nguyễn Thị Lan Anh', role: 'Nhà sáng lập & CEO', emoji: '👩‍💼', desc: 'Mẹ của 2 bé, 10 năm kinh nghiệm trong ngành hàng mẹ & bé.' },
  { name: 'Trần Minh Khôi', role: 'Giám đốc Sản phẩm', emoji: '👨‍💻', desc: 'Chuyên gia dinh dưỡng trẻ em với hơn 8 năm nghiên cứu.' },
  { name: 'Phạm Thị Thu Hà', role: 'Trưởng phòng CSKH', emoji: '👩‍🏫', desc: 'Luôn đặt sự hài lòng của mẹ và bé lên hàng đầu.' },
];

export default function AboutPage() {
  return (
    <div className="about-root">

      {/* HERO */}
      <div className="about-hero">
        <div className="about-hero-inner">
          <span className="about-badge">🏪 Câu chuyện của chúng tôi</span>
          <h1>Bé<em>Yêu</em>Shop — Nơi Yêu Thương Bắt Đầu</h1>
          <p>
            Được thành lập năm 2017 bởi một người mẹ trẻ với trái tim đầy nhiệt huyết,
            BeYêuShop ra đời từ mong muốn mang đến những sản phẩm chất lượng nhất,
            an toàn nhất cho các thiên thần nhỏ của Việt Nam.
          </p>
        </div>
      </div>

      {/* STATS */}
      <div className="about-stats">
        {stats.map((s, i) => (
          <div className="about-stat-card" key={i}>
            <span className="about-stat-icon">{s.icon}</span>
            <strong>{s.number}</strong>
            <span>{s.label}</span>
          </div>
        ))}
      </div>

      {/* CÂU CHUYỆN */}
      <div className="about-section">
        <div className="about-story">
          <div className="about-story-text">
            <h2>Hành trình 8 năm đồng hành cùng mẹ Việt</h2>
            <p>
              Năm 2017, khi con gái đầu lòng bắt đầu ăn dặm, chị Lan Anh — nhà sáng lập của BeYêuShop —
              nhận ra rằng thị trường Việt Nam còn thiếu một địa chỉ tin cậy, nơi mẹ có thể tìm thấy
              đầy đủ sản phẩm chất lượng cho hành trình nuôi con.
            </p>
            <p>
              Từ một cửa hàng nhỏ tại Biên Hoà, Đồng Nai, BeYêuShop đã lớn mạnh trở thành một trong
              những thương hiệu uy tín hàng đầu về sản phẩm mẹ & bé tại Việt Nam, phục vụ hơn
              50.000 gia đình trên khắp cả nước.
            </p>
            <p>
              Chúng tôi tự hào là đối tác chính thức của hơn 100 thương hiệu uy tín trong nước và
              quốc tế, cam kết 100% hàng chính hãng, có nguồn gốc xuất xứ rõ ràng.
            </p>
          </div>
          <div className="about-story-visual">
            <div className="about-blob">
              <span>👶</span>
              <div className="about-blob-badge about-blob-badge--1">🌿 Organic</div>
              <div className="about-blob-badge about-blob-badge--2">✅ Chính hãng</div>
              <div className="about-blob-badge about-blob-badge--3">🚚 Miễn ship</div>
            </div>
          </div>
        </div>
      </div>

      {/* GIÁ TRỊ CỐT LÕI */}
      <div className="about-values-wrap">
        <div className="about-section">
          <h2 className="about-section-title">Giá trị cốt lõi</h2>
          <div className="about-values">
            {values.map((v, i) => (
              <div className="about-value-card" key={i}>
                <span className="about-value-icon">{v.icon}</span>
                <h3>{v.title}</h3>
                <p>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ĐỘI NGŨ */}
      <div className="about-section">
        <h2 className="about-section-title">Đội ngũ sáng lập</h2>
        <div className="about-team">
          {team.map((m, i) => (
            <div className="about-team-card" key={i}>
              <div className="about-team-avatar">{m.emoji}</div>
              <h3>{m.name}</h3>
              <span className="about-team-role">{m.role}</span>
              <p>{m.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CAM KẾT */}
      <div className="about-commitment">
        <h2>Cam kết của BeYêuShop</h2>
        <p>
          Mỗi sản phẩm trên BeYêuShop đều được chúng tôi tự tay lựa chọn và kiểm định —
          như thể chúng tôi đang chọn cho chính con của mình.
        </p>
        <div className="about-commitment-badges">
          {['🌿 100% Chính hãng', '🔄 Đổi trả 30 ngày', '🚚 Giao hàng toàn quốc', '📞 Hỗ trợ 24/7'].map((b, i) => (
            <span key={i} className="about-commit-badge">{b}</span>
          ))}
        </div>
      </div>

    </div>
  );
}
