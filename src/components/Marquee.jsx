import './Marquee.css';

export default function Marquee() {
  const items = [
    'Development', 'Design', 'Creative', 'Frontend', 'Backend', 'Interactive'
  ];

  // Helper to render the text sequence
  const renderContent = () => (
    <div className="marquee-content">
      {items.concat(items).map((item, idx) => (
        <div key={idx} className="marquee-item-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '3.5rem' }}>
          <span className={`marquee-item ${idx % 2 === 0 ? '' : 'outline'}`}>
            {item}
          </span>
          <span className="marquee-star">✦</span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="marquee-container select-none">
      <div className="marquee-track">
        {renderContent()}
        {renderContent()}
      </div>
    </div>
  );
}
