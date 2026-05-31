import { useEffect } from 'react';

/**
 * ConfirmDialog — Reusable confirmation modal
 *
 * Props:
 *   isOpen        {boolean}   — controls visibility
 *   onClose       {function}  — called when cancelled / backdrop clicked
 *   onConfirm     {function}  — called when confirm button clicked
 *   title         {string}    — dialog heading
 *   message       {string}    — body text / description
 *   confirmText   {string}    — confirm button label  (default: "Confirm")
 *   cancelText    {string}    — cancel button label   (default: "Cancel")
 *   confirmVariant {string}   — "danger" | "primary" | "success" | "warning"
 *   icon          {string}    — Bootstrap icon class e.g. "bi-trash3", "bi-save", "bi-check-circle"
 *   loading       {boolean}   — disables buttons and shows spinner on confirm btn
 */
const VARIANT_STYLES = {
  danger:  { bg: 'rgba(239,68,68,0.15)',   border: 'rgba(239,68,68,0.35)',   btn: 'linear-gradient(135deg,#ef4444,#dc2626)', icon: '#f87171' },
  primary: { bg: 'rgba(139,92,246,0.15)',  border: 'rgba(139,92,246,0.35)',  btn: 'var(--nex-gradient)',                     icon: '#a78bfa' },
  success: { bg: 'rgba(16,185,129,0.15)',  border: 'rgba(16,185,129,0.35)',  btn: 'linear-gradient(135deg,#10b981,#059669)', icon: '#34d399' },
  warning: { bg: 'rgba(245,158,11,0.15)',  border: 'rgba(245,158,11,0.35)',  btn: 'linear-gradient(135deg,#f59e0b,#d97706)', icon: '#fbbf24' },
};

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmVariant = 'primary',
  icon = 'bi-question-circle',
  loading = false,
}) => {
  const variant = VARIANT_STYLES[confirmVariant] || VARIANT_STYLES.primary;

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 1050,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(6px)',
          animation: 'nex-dialog-fade-in 0.15s ease',
        }}
      />

      {/* Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        style={{
          position: 'fixed', inset: 0, zIndex: 1051,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '16px',
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            width: '100%', maxWidth: 420,
            background: 'var(--nex-bg-card)',
            border: `1px solid ${variant.border}`,
            borderRadius: 18,
            padding: '32px 28px 24px',
            boxShadow: `0 24px 80px rgba(0,0,0,0.5), 0 0 0 1px ${variant.border}`,
            animation: 'nex-dialog-slide-in 0.2s cubic-bezier(0.34,1.56,0.64,1)',
            pointerEvents: 'all',
          }}
        >
          {/* Icon badge */}
          <div style={{
            width: 52, height: 52, borderRadius: 14,
            background: variant.bg,
            border: `1px solid ${variant.border}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 20,
          }}>
            <i className={`bi ${icon}`} style={{ fontSize: '1.4rem', color: variant.icon }} />
          </div>

          {/* Title */}
          <h4
            id="confirm-dialog-title"
            style={{
              color: 'var(--nex-text-light, #f0f4ff)',
              fontWeight: 700, fontSize: '1.1rem',
              marginBottom: 10, lineHeight: 1.3,
            }}
          >
            {title}
          </h4>

          {/* Message */}
          <p style={{
            color: 'var(--nex-text-muted, rgba(240,244,255,0.55))',
            fontSize: '0.88rem', lineHeight: 1.7,
            marginBottom: 28,
          }}>
            {message}
          </p>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            {/* Cancel */}
            <button
              onClick={onClose}
              disabled={loading}
              style={{
                padding: '10px 20px', borderRadius: 10, fontWeight: 600,
                fontSize: '0.88rem', cursor: 'pointer',
                background: 'transparent',
                border: '1px solid var(--nex-border, rgba(255,255,255,0.1))',
                color: 'var(--nex-text-muted, rgba(240,244,255,0.55))',
                transition: 'all 0.18s',
                opacity: loading ? 0.5 : 1,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                e.currentTarget.style.color = 'var(--nex-text-light, #f0f4ff)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = 'var(--nex-text-muted, rgba(240,244,255,0.55))';
              }}
            >
              {cancelText}
            </button>

            {/* Confirm */}
            <button
              onClick={onConfirm}
              disabled={loading}
              style={{
                padding: '10px 22px', borderRadius: 10, fontWeight: 700,
                fontSize: '0.88rem', cursor: loading ? 'not-allowed' : 'pointer',
                background: variant.btn,
                border: 'none', color: 'white',
                display: 'flex', alignItems: 'center', gap: 8,
                transition: 'opacity 0.18s, transform 0.18s',
                opacity: loading ? 0.7 : 1,
              }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.opacity = '0.88'; }}
              onMouseLeave={e => { e.currentTarget.style.opacity = loading ? '0.7' : '1'; }}
            >
              {loading && (
                <span style={{
                  width: 14, height: 14, borderRadius: '50%',
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTopColor: 'white',
                  animation: 'nex-spin 0.6s linear infinite',
                  display: 'inline-block', flexShrink: 0,
                }} />
              )}
              {confirmText}
            </button>
          </div>
        </div>
      </div>

      {/* Keyframe styles */}
      <style>{`
        @keyframes nex-dialog-fade-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes nex-dialog-slide-in {
          from { opacity: 0; transform: scale(0.88) translateY(12px); }
          to   { opacity: 1; transform: scale(1)    translateY(0);     }
        }
        @keyframes nex-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
};

export default ConfirmDialog;
