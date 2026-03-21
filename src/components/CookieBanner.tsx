import * as React from 'react';
import { useState, useEffect } from 'react';

export function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem('privacy-accepted');
    if (!accepted) setShow(true);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50
                    bg-brand-navy/98 border-t border-white/10
                    p-4 flex flex-col sm:flex-row items-center
                    justify-between gap-4 backdrop-blur-md">
      <p className="text-sm text-white/70 max-w-2xl">
        We use <strong className="text-white">no cookies</strong> for
        tracking. Your name and age stay in your browser only and are
        never sent to our servers.{' '}
        <a href="/privacy"
           className="text-brand-gold underline hover:no-underline">
          Privacy Policy
        </a>
      </p>
      <button
        onClick={() => {
          localStorage.setItem('privacy-accepted', '1');
          setShow(false);
        }}
        className="bg-brand-gold text-brand-navy text-sm font-bold
                   px-5 py-2.5 rounded-xl whitespace-nowrap
                   hover:bg-[#bf861e] transition-colors"
      >
        Got it ✓
      </button>
    </div>
  );
}
