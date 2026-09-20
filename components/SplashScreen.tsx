import React from 'react';
import PlusIcon from './icons/PlusIcon';

interface SplashScreenProps {
  onDismiss: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onDismiss }) => {
  return (
    <div
      id="splash-screen-overlay"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        padding: '1.25rem',
        animation: 'splashFadeIn 0.3s ease-out forwards',
      }}
      onClick={onDismiss}
    >
      <style>{`
        @keyframes splashFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes splashSlideUp {
          from {
            opacity: 0;
            transform: scale(0.96) translateY(18px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        .splash-modal-card {
          animation: splashSlideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      <div
        id="splash-modal-card"
        className="splash-modal-card"
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '1.25rem',
          width: '100%',
          maxWidth: '560px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(0, 0, 0, 0.05)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
        }}
      >
        {/* Decorative Top Accent Bar */}
        <div
          style={{
            height: '6px',
            width: '100%',
            background: 'linear-gradient(90deg, #9333ea 0%, #a855f7 50%, #c084fc 100%)',
          }}
        />

        <div style={{ padding: '2rem 1.75rem 1.5rem 1.75rem' }}>
          {/* Header Icon + Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '0.875rem',
                backgroundColor: '#f3e8ff',
                color: '#9333ea',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                boxShadow: '0 4px 6px -1px rgba(147, 51, 234, 0.15)',
              }}
            >
              <PlusIcon style={{ width: '28px', height: '28px' }} />
            </div>
            <div>
              <h2
                id="splash-title"
                style={{
                  margin: 0,
                  fontSize: '1.25rem',
                  fontWeight: 800,
                  color: '#111827',
                  letterSpacing: '-0.02em',
                }}
              >
                Welcome to My GiGs and Side-Hustles Tracker
              </h2>
            </div>
          </div>

          {/* Quick Start Instructions Box */}
          <div
            id="splash-instructions-box"
            style={{
              backgroundColor: '#faf5ff',
              border: '1px solid #e9d5ff',
              borderRadius: '0.875rem',
              padding: '1.125rem',
              marginBottom: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: '#9333ea',
                  color: '#ffffff',
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  flexShrink: 0,
                  marginTop: '1px',
                }}
              >
                +
              </span>
              <p
                style={{
                  margin: 0,
                  fontSize: '0.9375rem',
                  lineHeight: '1.5',
                  color: '#374151',
                  fontWeight: 500,
                }}
              >
                To create a new GiG Job Record, click the Plus (+) Add icon button on the lower right to begin.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: '#e9d5ff',
                  color: '#7e22ce',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  flexShrink: 0,
                  marginTop: '1px',
                }}
              >
                ✎
              </span>
              <p
                style={{
                  margin: 0,
                  fontSize: '0.9375rem',
                  lineHeight: '1.5',
                  color: '#374151',
                  fontWeight: 500,
                }}
              >
                To update or delete an existing GiG record, click the menu dots on the screen of the record.
              </p>
            </div>
          </div>

          {/* Company & Website Attribution */}
          <div
            id="splash-attribution-section"
            style={{
              borderTop: '1px solid #f3f4f6',
              paddingTop: '1.25rem',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.25rem',
            }}
          >
            <div
              style={{
                fontSize: '1rem',
                fontWeight: 700,
                color: '#111827',
                letterSpacing: '-0.01em',
              }}
            >
              GiGs &amp; Side-Hustle Technologies, LLC
            </div>
            <div
              style={{
                fontSize: '0.875rem',
                fontWeight: 500,
                color: '#6b7280',
              }}
            >
              A Mississippi Company
            </div>
            <div style={{ marginTop: '0.25rem' }}>
              <a
                id="splash-website-link"
                href="https://www.mygigsandsht.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#9333ea',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                }}
                onMouseOver={(e) => (e.currentTarget.style.textDecoration = 'underline')}
                onMouseOut={(e) => (e.currentTarget.style.textDecoration = 'none')}
              >
                www.mygigsandsht.com
              </a>
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div
          style={{
            padding: '1rem 1.75rem 1.5rem 1.75rem',
            backgroundColor: '#f9fafb',
            borderTop: '1px solid #f3f4f6',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <button
            id="splash-continue-button"
            onClick={onDismiss}
            style={{
              width: '100%',
              backgroundColor: '#9333ea',
              color: '#ffffff',
              padding: '0.875rem 1.5rem',
              borderRadius: '0.75rem',
              fontWeight: 700,
              fontSize: '1rem',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 6px -1px rgba(147, 51, 234, 0.4)',
              transition: 'background-color 0.15s, transform 0.1s',
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#7e22ce')}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#9333ea')}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
