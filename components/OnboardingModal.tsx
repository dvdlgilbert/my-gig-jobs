import React, { useEffect, useState } from 'react';
import { useTranslation } from '../translations';
import { Language } from '../types';

interface Props {
  lang: Language;
}

const OnboardingModal: React.FC<Props> = ({ lang }) => {
  const t = useTranslation(lang);

  const [show, setShow] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  // Detect platform
  const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);
  const isAndroid = /Android/.test(navigator.userAgent);
  const isDesktop = !isIOS && !isAndroid;

  useEffect(() => {
    // Only show on first launch
    const hasSeen = localStorage.getItem('installModalSeen');
    if (hasSeen) return;

    // Listen for Android/Desktop install prompt
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShow(true);
    });

    // iOS Safari never fires beforeinstallprompt
    if (isIOS) {
      setShow(true);
    }
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      console.log('Install choice:', choice.outcome);
    }
    localStorage.setItem('installModalSeen', 'true');
    setShow(false);
  };

  const handleLater = () => {
    localStorage.setItem('installModalSeen', 'true');
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl p-6 w-11/12 max-w-md">
        <h2 className="text-xl font-bold mb-2">{t.installApp}</h2>
        <p className="text-gray-700 mb-4">{t.installAppDescription}</p>

        {/* Device-specific instructions */}
        {isIOS && (
          <p className="text-blue-600 font-medium mb-4">
            {t.installOnIOS}
          </p>
        )}

        {isAndroid && (
          <p className="text-blue-600 font-medium mb-4">
            {t.installOnAndroid}
          </p>
        )}

        {isDesktop && (
          <p className="text-blue-600 font-medium mb-4">
            {t.installOnDesktop}
          </p>
        )}

        {/* Buttons */}
        {!isIOS && (
          <button
            onClick={handleInstall}
            className="w-full bg-green-600 text-white py-2 rounded-lg mb-3"
          >
            {t.installNow}
          </button>
        )}

        <button
          onClick={handleLater}
          className="w-full bg-gray-300 text-gray-800 py-2 rounded-lg"
        >
          {t.later}
        </button>
      </div>
    </div>
  );
};

export default OnboardingModal;


