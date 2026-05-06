import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const TABS = [
  { key: 'personal', label: 'Personal Info', icon: 'bi-person-fill' },
  { key: 'security', label: 'Security', icon: 'bi-shield-lock-fill' },
  { key: 'addresses', label: 'Addresses', icon: 'bi-geo-alt-fill' },
];

const Profile = () => {
  const { user } = useSelector(state => state.userStore);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('personal');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!user || !user.email) navigate('/login');
  }, [user, navigate]);

  if (!user || !user.email) return null;

  const initials = user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'U';

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div style={{ background: 'var(--nex-bg)', minHeight: '100vh' }}>
      {/* Page hero */}
      <div className="nex-page-hero">
        <div className="nex-orb" style={{ width: 280, height: 280, background: '#F472B6', top: '-50%', right: '-4%', opacity: 0.08 }} />
        <div className="container-fluid px-4 px-lg-5 position-relative">
          <p className="nex-label mb-2">NexMart</p>
          <h1 className="nex-text-light fw-bold mb-2" style={{ fontSize: '2rem' }}>My Profile</h1>
          <p className="nex-breadcrumb mb-0">
            <Link to="/">Home</Link><span className="nex-breadcrumb-sep">›</span>
            <span className="nex-text-light fw-semibold">Profile</span>
          </p>
        </div>
      </div>

      <div className="container-fluid px-4 px-lg-5 py-5">
        <div className="row g-4">
          {/* Left: avatar card */}
          <div className="col-lg-4 col-xl-3">
            <div className="nex-glass-card p-4 text-center">
              <div className="mx-auto rounded-circle d-flex align-items-center justify-content-center mb-3 nex-icon-grad"
                style={{ width: 88, height: 88, fontSize: '2rem', fontWeight: 700, color: 'white' }}>
                {initials}
              </div>
              <h4 className="nex-text-light fw-bold mb-1" style={{ fontSize: '1.1rem' }}>{user.name}</h4>
              <p className="nex-text-muted mb-3" style={{ fontSize: '0.85rem' }}>{user.email}</p>
              <div className="d-flex justify-content-center gap-2 mb-4">
                <span className={`nex-status ${user.isVerified ? 'nex-status-green' : 'nex-status-yellow'}`} style={{ fontSize: '0.72rem' }}>
                  <i className={`bi ${user.isVerified ? 'bi-check-circle-fill' : 'bi-exclamation-circle-fill'}`} />
                  {user.isVerified ? 'Verified' : 'Unverified'}
                </span>
                <span className="nex-status nex-status-blue" style={{ fontSize: '0.72rem', textTransform: 'capitalize' }}>
                  <i className="bi bi-person-fill" />{user.role || 'Customer'}
                </span>
              </div>

              <div style={{ height: 1, background: 'var(--nex-border)', marginBottom: 20 }} />

              <div className="d-flex flex-column gap-1 text-start">
                {TABS.map(tab => (
                  <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                    className="d-flex align-items-center gap-3 px-3 py-2 rounded w-100"
                    style={{
                      border: 'none', textAlign: 'left', fontSize: '0.88rem', fontWeight: 600, cursor: 'pointer',
                      background: activeTab === tab.key ? 'rgba(139,92,246,0.12)' : 'transparent',
                      color: activeTab === tab.key ? 'var(--nex-purple)' : 'var(--nex-text-muted)',
                      transition: 'all 0.2s',
                    }}>
                    <i className={`bi ${tab.icon}`} style={{ fontSize: '1rem', width: 18 }} />
                    {tab.label}
                    {activeTab === tab.key && <i className="bi bi-chevron-right ms-auto" style={{ fontSize: '0.7rem' }} />}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick stats */}
            <div className="nex-glass-card p-4 mt-4">
              <p className="nex-label mb-3">Account Stats</p>
              {[
                { icon: 'bi-box-seam', label: 'Total Orders', value: '5' },
                { icon: 'bi-heart-fill', label: 'Wishlist Items', value: '12' },
                { icon: 'bi-star-fill', label: 'Reviews Posted', value: '3' },
              ].map(s => (
                <div key={s.label} className="d-flex align-items-center justify-content-between py-2" style={{ borderBottom: '1px solid var(--nex-border)' }}>
                  <div className="d-flex align-items-center gap-2">
                    <i className={`bi ${s.icon} nex-text-purple`} style={{ fontSize: '0.9rem' }} />
                    <span className="nex-text-muted" style={{ fontSize: '0.82rem' }}>{s.label}</span>
                  </div>
                  <span className="nex-text-light fw-bold" style={{ fontSize: '0.88rem' }}>{s.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: tab content */}
          <div className="col-lg-8 col-xl-9">
            {activeTab === 'personal' && (
              <div className="nex-glass-card p-4 p-xl-5">
                <h5 className="nex-text-light fw-bold mb-4" style={{ fontSize: '1.1rem' }}>Personal Information</h5>
                <form onSubmit={handleSave}>
                  <div className="row g-4">
                    <div className="col-md-6">
                      <label className="nex-form-label">Full Name</label>
                      <input type="text" defaultValue={user.name} className="nex-input" />
                    </div>
                    <div className="col-md-6">
                      <label className="nex-form-label">Email Address</label>
                      <input type="email" defaultValue={user.email} disabled className="nex-input" />
                    </div>
                    <div className="col-md-6">
                      <label className="nex-form-label">Phone Number</label>
                      <input type="tel" placeholder="+1 (555) 000-0000" className="nex-input" />
                    </div>
                    <div className="col-md-6">
                      <label className="nex-form-label">Date of Birth</label>
                      <input type="date" className="nex-input" />
                    </div>
                    <div className="col-md-6">
                      <label className="nex-form-label">Gender</label>
                      <select className="nex-input" style={{ cursor: 'pointer' }}>
                        <option value="">Prefer not to say</option>
                        <option>Male</option>
                        <option>Female</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="nex-form-label">Country</label>
                      <input type="text" placeholder="Australia" className="nex-input" />
                    </div>
                    <div className="col-12">
                      <button type="submit"
                        className="nex-btn-primary"
                        style={{ padding: '12px 32px', background: saved ? 'linear-gradient(135deg,#10b981,#059669)' : undefined, transition: 'all 0.3s' }}>
                        {saved ? <><i className="bi bi-check-lg me-2" />Saved!</> : <>Save Changes <i className="bi bi-arrow-right ms-1" /></>}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="nex-glass-card p-4 p-xl-5">
                <h5 className="nex-text-light fw-bold mb-4" style={{ fontSize: '1.1rem' }}>Security Settings</h5>
                <div className="d-flex flex-column gap-4">
                  {/* Change password */}
                  <div className="p-4 rounded" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--nex-border)', borderRadius: 12 }}>
                    <p className="nex-text-light fw-bold mb-1">Change Password</p>
                    <p className="nex-text-muted mb-4" style={{ fontSize: '0.85rem' }}>Choose a strong password and don't reuse it for other accounts.</p>
                    <div className="d-flex flex-column gap-3" style={{ maxWidth: 440 }}>
                      <div>
                        <label className="nex-form-label">Current Password</label>
                        <input type="password" placeholder="••••••••••••" className="nex-input" />
                      </div>
                      <div>
                        <label className="nex-form-label">New Password</label>
                        <input type="password" placeholder="Min 8 characters" className="nex-input" />
                      </div>
                      <div>
                        <label className="nex-form-label">Confirm New Password</label>
                        <input type="password" placeholder="••••••••••••" className="nex-input" />
                      </div>
                      <button className="nex-btn-primary" style={{ padding: '11px 28px', alignSelf: 'flex-start' }}>
                        Update Password
                      </button>
                    </div>
                  </div>

                  {/* 2FA */}
                  <div className="p-4 d-flex align-items-center justify-content-between gap-4 rounded" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--nex-border)', borderRadius: 12 }}>
                    <div>
                      <p className="nex-text-light fw-bold mb-1">Two-Factor Authentication</p>
                      <p className="nex-text-muted mb-0" style={{ fontSize: '0.85rem' }}>Add an extra layer of security to your account.</p>
                    </div>
                    <button className="nex-btn-outline" style={{ padding: '9px 20px', fontSize: '0.84rem', flexShrink: 0 }}>Enable 2FA</button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'addresses' && (
              <div className="nex-glass-card p-4 p-xl-5">
                <div className="d-flex align-items-center justify-content-between mb-4">
                  <h5 className="nex-text-light fw-bold mb-0" style={{ fontSize: '1.1rem' }}>Saved Addresses</h5>
                  <button className="nex-btn-primary" style={{ padding: '9px 20px', fontSize: '0.84rem' }}>
                    <i className="bi bi-plus-lg me-1" />Add Address
                  </button>
                </div>
                <div className="d-flex flex-column gap-3">
                  {[
                    { label: 'Home', address: '12 Ocean View Drive, Sydney NSW 2000, Australia', default: true, icon: 'bi-house-fill' },
                    { label: 'Work', address: '55 Martin Place, Sydney NSW 2000, Australia', default: false, icon: 'bi-building' },
                  ].map((addr, i) => (
                    <div key={i} className="p-4 rounded d-flex align-items-start justify-content-between gap-3"
                      style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${addr.default ? 'rgba(139,92,246,0.4)' : 'var(--nex-border)'}`, borderRadius: 12 }}>
                      <div className="d-flex gap-3">
                        <i className={`bi ${addr.icon} nex-text-purple mt-1`} style={{ flexShrink: 0, fontSize: '1.1rem' }} />
                        <div>
                          <div className="d-flex align-items-center gap-2 mb-1">
                            <span className="nex-text-light fw-bold" style={{ fontSize: '0.9rem' }}>{addr.label}</span>
                            {addr.default && <span className="nex-status nex-status-blue" style={{ fontSize: '0.65rem' }}>Default</span>}
                          </div>
                          <p className="nex-text-muted mb-0" style={{ fontSize: '0.85rem' }}>{addr.address}</p>
                        </div>
                      </div>
                      <div className="d-flex gap-2 flex-shrink-0">
                        <button className="nex-btn-outline" style={{ padding: '6px 14px', fontSize: '0.78rem' }}>Edit</button>
                        <button style={{ background: 'transparent', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: '6px 14px', fontSize: '0.78rem', color: '#f87171', cursor: 'pointer' }}>Remove</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
